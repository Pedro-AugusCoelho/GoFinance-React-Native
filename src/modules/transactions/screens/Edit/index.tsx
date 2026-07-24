import React, { useRef, useState, useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Animated, FlatList, KeyboardAvoidingView, Modal, Platform, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import * as R from './styles';
import { EditRouteProp, AppStackNavigationProp } from "../../../../app/navigation/stack.routes";
import { categories } from "../../domain/categories";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionDTO } from "../../storage/transaction.dto";
import { listTransactions } from '../../application/list-transactions';
import { editTransactionPlan } from '../../application/edit-transaction-plan';
import { deleteTransactionPlan } from '../../application/delete-transaction-plan';
import { getErrorMessage } from '../../../../core/errors/app-error'
import { CurrencyInput } from '../../../../shared/components/CurrencyInput'
import { getCurrentDate } from '../../domain/transaction-date'

interface FormData {
    name:string;
    value:number;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .trim()
    .required('Nome é obrigátorio'),
    value: Yup
    .number()
    .integer('Informe um valor válido')
    .typeError('Informe um valor númerico')
    .positive('Informe somente valores positivos')
    .required('Preço é obrigátorio')
})

export function Edit() {
    const navigation: AppStackNavigationProp = useNavigation()
    
    const route = useRoute<EditRouteProp>()
    
    const { params } = route;
    
    const {
        control,
        setValue,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        // @ts-ignore
        resolver: yupResolver(schema)
    });
    const formControll = control as unknown as Control<FieldValues, any>

    const [id, setId] = useState('');
    const [date, setDate] = useState<Date>();
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDTO | null>(null);
    const [transactionType, setTransactionType] = useState<'income' | 'outcome' | ''>('');
    const [isSaving, setIsSaving] = useState(false)
    const incomeButtonScale = useRef(new Animated.Value(1)).current
    const outcomeButtonScale = useRef(new Animated.Value(1)).current
    const [modalCategory, setModalCategory] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });
    const [showDatePicker, setShowDatePicker] = useState(false)

    function animateTypeButton(scale: Animated.Value, toValue: number) {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            speed: 24,
            bounciness: 6,
        }).start()
    }

    useEffect(() => {
        async function handleFindParameter() {
         const currentData = await listTransactions();
         const located = currentData.find((item:{id: string})  => item.id === params.id)
 
         if (located) {
             const findCategory = categories.find(item => item.key === located.category)
             setSelectedTransaction(located)
             setId(params.id)
             setDate(new Date(located.date))
             setValue('name', located.name)
             setValue('value', located.value)
             setTransactionType(located.type)
             if (findCategory) {
                setCategory({
                     key: findCategory.key,
                     name: findCategory.name
                 })
             }
         }
 
        }
        handleFindParameter()
     },[])

    function getInstallmentTotal(transaction: TransactionDTO) {
        if (transaction.installmentTotal) {
            return transaction.installmentTotal
        }

        const amount = Number(transaction.amount)
        return Number.isFinite(amount) && amount > 0 ? amount : 1
    }

    function sortByInstallmentOrDate(a: TransactionDTO, b: TransactionDTO) {
        if (a.installmentNumber && b.installmentNumber) {
            return a.installmentNumber - b.installmentNumber
        }

        return new Date(a.date).getTime() - new Date(b.date).getTime()
    }

    async function applyEdit(scope: 'one' | 'future' | 'all', form: FormData) {
        if (!selectedTransaction || !date) {
            return
        }

        if (!Number.isInteger(form.value) || form.value <= 0) {
            Alert.alert('Valor inválido', 'Informe um valor válido.')
            return
        }

        setIsSaving(true)
        try {
            await editTransactionPlan({
                id: params.id,
                scope,
                name: form.name.trim(),
                valueCents: form.value,
                type: transactionType as 'income' | 'outcome',
                category: category.key,
                date,
            })

            reset()
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'Categoria',
            })

            navigation.push('Home')
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível salvar a alteração.'))
        } finally {
            setIsSaving(false)
        }
    }

    function handleOpenCategoryModal() {
        setModalCategory(true)
    }

    function handleCloseCategoryModal() {
        setModalCategory(false)
    }

    function handleCategorySelect(item: typeof categories[number]) {
        setCategory({
            key: item.key,
            name: item.name,
        })
        handleCloseCategoryModal()
    }

    function handleBackWindow () {
        navigation.goBack()
    }

    async function handleEdit (form: FormData) {
        if(category.key === 'category') {
            Alert.alert('Selecione a categoria')
            return
        }
        if(!transactionType) {
            Alert.alert('Selecione o tipo da transação')
            return
        }
        if (!selectedTransaction || !date) {
            Alert.alert('Não foi possível carregar os dados da transação')
            return
        }

        try {
            const installmentTotal = getInstallmentTotal(selectedTransaction)
            const hasPlan = Boolean(selectedTransaction.planId && installmentTotal > 1)

            if (!hasPlan) {
                await applyEdit('one', form)
                return
            }

            Alert.alert(
                'Editar parcelas',
                'Deseja aplicar a edição em qual escopo?',
                [
                    { text: 'Somente esta', onPress: () => applyEdit('one', form) },
                    { text: 'Esta e próximas', onPress: () => applyEdit('future', form) },
                    { text: 'Todas', onPress: () => applyEdit('all', form) },
                    { text: 'Cancelar', style: 'cancel' },
                ]
            )

        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível salvar a alteração.'))
        }
    }

    async function applyDelete(scope: 'one' | 'future' | 'all') {
        if (!selectedTransaction) {
            return
        }

        try {
            await deleteTransactionPlan(params.id, scope)
            navigation.push('Home')
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível excluir a transação.'))
        }
    }

    async function handleDeleteTransaction () {
        if (!selectedTransaction) {
            return
        }

        const installmentTotal = getInstallmentTotal(selectedTransaction)
        const hasPlan = Boolean(selectedTransaction.planId && installmentTotal > 1)

        if (!hasPlan) {
            await applyDelete('one')
            return
        }

        Alert.alert(
            'Excluir parcelas',
            'Deseja excluir qual escopo?',
            [
                { text: 'Somente esta', onPress: () => applyDelete('one') },
                { text: 'Esta e próximas', onPress: () => applyDelete('future') },
                { text: 'Todas', style: 'destructive', onPress: () => applyDelete('all') },
                { text: 'Cancelar', style: 'cancel' },
            ]
        )
    }

    return(
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        {/* @ts-ignore */}
        <R.Container>
                    {/* @ts-ignore */}
                    <R.Header>
                        <R.GoBack onPress={() => handleBackWindow()}>
                            {/* @ts-ignore */}
                            <R.IconGoBack name='chevron-left' />
                        </R.GoBack>
                        
                        <R.Title>Editar</R.Title>
                    </R.Header>

                    {/* @ts-ignore */}
                    <R.Body>
                        {/* @ts-ignore */}
                        <R.InputContainer>
                            {selectedTransaction?.planId && getInstallmentTotal(selectedTransaction) > 1 && (
                                <R.InstallmentInfo>
                                    <R.InstallmentInfoText>
                                        {`Parcela ${selectedTransaction.installmentNumber || 1}/${getInstallmentTotal(selectedTransaction)}`}
                                    </R.InstallmentInfoText>
                                </R.InstallmentInfo>
                            )}

                            <Controller
                                name='name'
                                control={formControll}
                                render={({ field: { onChange, value} }) => (
                                    <R.Input
                                        value={value}
                                        keyboardType="default"
                                        placeholder="Nome"
                                        onChangeText={onChange}
                                        autoCapitalize='sentences'
                                        autoCorrect={false}
                                    />
                                )}
                            />
                            { errors.name && <R.Error>{ errors.name.message }</R.Error> }

                            <Controller
                                name='value'
                                control={formControll}
                                render={({ field: { onChange, value} }) => (
                                    <CurrencyInput
                                        value={value}
                                        onChangeValue={onChange}
                                    />
                                )}
                            />
                            { errors.value && <R.Error>{ errors.value.message }</R.Error> }

                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <R.Input
                                    value={date ? date.toLocaleDateString('pt-BR') : date}
                                    placeholder="Selecionar Data"
                                    editable={false}
                                />
    
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date ?? getCurrentDate()}
                                        mode="date"
                                        display={Platform.OS === 'android' ? 'spinner' : 'default'}
                                        positiveButton={{ label: 'OK', textColor: '#00875F' }}
                                        negativeButton={{ label: 'Cancelar', textColor: '#00875F' }}
                                        onChange={(event, selectedDate) => {
                                            const currentDate = selectedDate || date
                                            setShowDatePicker(Platform.OS === 'ios')
                                            setDate(currentDate)
                                        }}
                                    />
                                )}
                            </TouchableOpacity>

                            {/* @ts-ignore */}
                            <R.BoxBtn>
                                {/* @ts-ignore */}
                                <Animated.View style={{ flex: 1, minHeight: 58, transform: [{ scale: incomeButtonScale }] }}>
                                    <R.BtnSelected
                                        onPress={() => setTransactionType('income')}
                                        onPressIn={() => animateTypeButton(incomeButtonScale, 0.96)}
                                        onPressOut={() => animateTypeButton(incomeButtonScale, 1)}
                                        isActive={transactionType === 'income'}
                                        type={transactionType}
                                    >
                                        <R.Icon name='arrow-up-circle' type='income'/>
                                        <R.TextBtn>Entrada</R.TextBtn>
                                    </R.BtnSelected>
                                </Animated.View>

                                {/* @ts-ignore */}
                                <Animated.View style={{ flex: 1, minHeight: 58, transform: [{ scale: outcomeButtonScale }] }}>
                                    <R.BtnSelected
                                        onPress={() => setTransactionType('outcome')}
                                        onPressIn={() => animateTypeButton(outcomeButtonScale, 0.96)}
                                        onPressOut={() => animateTypeButton(outcomeButtonScale, 1)}
                                        isActive={transactionType === 'outcome'}
                                        type={transactionType}
                                    >
                                        <R.Icon name='arrow-down-circle' type='outcome'/>
                                        <R.TextBtn>Saída</R.TextBtn>
                                    </R.BtnSelected>
                                </Animated.View>
                            </R.BoxBtn>

                            <R.Category onPress={handleOpenCategoryModal}>
                                <R.CategoryInfo>
                                    {category.key !== 'category' && (
                                        <R.CategorySelectedIcon
                                            name={categories.find(item => item.key === category.key)?.icon as React.ComponentProps<typeof R.CategorySelectedIcon>['name']}
                                        />
                                    )}
                                    <R.CategoryTitle>{category.name}</R.CategoryTitle>
                                </R.CategoryInfo>
                                <R.CategoryIcon name='chevron-down' />
                            </R.Category>

                        </R.InputContainer>

                        {/* @ts-ignore */}
                        <R.BtnContainer>
                            <R.BtnSubmit
                                onPress={handleSubmit(handleEdit as unknown as SubmitHandler<FieldValues>)}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <R.IconBtn name='save' />
                                        <R.TextSubmit>Salvar</R.TextSubmit>
                                    </>
                                )}
                            </R.BtnSubmit>
                            <R.BtnDelete onPress={() => handleDeleteTransaction()}>
                                <R.IconDelete name='trash-2' />
                                <R.TextDelete>Deletar</R.TextDelete>
                            </R.BtnDelete>
                        </R.BtnContainer>
                    </R.Body>

                    <Modal visible={modalCategory} transparent animationType="slide">
                        <R.ModalOverlay>
                            <R.ModalCard>
                                <R.ModalHeader>
                                    <R.ModalTitle>Selecione a categoria</R.ModalTitle>
                                    <R.ModalClose onPress={handleCloseCategoryModal}>
                                        <R.ModalCloseIcon name="x" />
                                    </R.ModalClose>
                                </R.ModalHeader>

                                <FlatList
                                    data={categories}
                                    keyExtractor={(item) => item.key}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <R.ModalCategoryItem
                                            onPress={() => handleCategorySelect(item)}
                                            isActive={category.key === item.key}
                                        >
                                            <R.ModalCategoryIcon
                                                name={item.icon as React.ComponentProps<typeof R.ModalCategoryIcon>['name']}
                                            />
                                            <R.ModalCategoryText>{item.name}</R.ModalCategoryText>
                                        </R.ModalCategoryItem>
                                    )}
                                    ItemSeparatorComponent={() => <R.ModalSeparator />}
                                />
                            </R.ModalCard>
                        </R.ModalOverlay>
                    </Modal>
            </R.Container>
        </KeyboardAvoidingView>
    )
}
