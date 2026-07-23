import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import * as R from './styles';
import { CategorySelect } from "../../components/CategorySelect";
import { EditRouteProp, AppStackNavigationProp } from "../../../../app/navigation/stack.routes";
import { categories } from "../../domain/categories";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionDTO } from "../../storage/transaction.dto";
import { listTransactions } from '../../application/list-transactions';
import { editTransactionPlan } from '../../application/edit-transaction-plan';
import { deleteTransactionPlan } from '../../application/delete-transaction-plan';
import { getErrorMessage } from '../../../../core/errors/app-error'
import { parseTransactionValue, roundCurrency } from '../../domain/transaction-money'

interface FormData {
    name:string;
    value:string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigátorio'),
    value: Yup
    .number()
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
    const [modalCategory, setModalCategory] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });
    const [showDatePicker, setShowDatePicker] = useState(false)

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
             setValue('value', String(located.value))
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

        const parsedValue = parseTransactionValue(form.value)
        const value = parsedValue === null ? null : roundCurrency(parsedValue)
        if (value === null) {
            Alert.alert('Valor inválido', 'Informe um valor válido.')
            return
        }

        await editTransactionPlan({
            id: params.id,
            scope,
            name: form.name,
            value,
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
    }

    function handleOpenCategoryModal() {
        setModalCategory(true)
    }

    function handleCloseCategoryModal() {
        setModalCategory(false)
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

        await deleteTransactionPlan(params.id, scope)

        navigation.push('Home')
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
                                    <R.Input
                                        value={value}
                                        keyboardType="numeric"
                                        placeholder="Preço"
                                        onChangeText={onChange}
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
                                        value={date ?? new Date()}
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
                                <R.BtnSelected onPress={() => setTransactionType('income')} isActive={transactionType === 'income'} type={transactionType}>
                                    <R.Icon name='arrow-up-circle' type='income'/>
                                    <R.TextBtn>Entrada</R.TextBtn>
                                </R.BtnSelected>

                                {/* @ts-ignore */}
                                <R.BtnSelected onPress={() => setTransactionType('outcome')} isActive={transactionType === 'outcome'} type={transactionType}>
                                    <R.Icon name='arrow-down-circle' type='outcome'/>
                                    <R.TextBtn>Saída</R.TextBtn>
                                </R.BtnSelected>
                            </R.BoxBtn>

                            <R.Category onPress={handleOpenCategoryModal}>
                                <R.CategoryTitle>{category.name}</R.CategoryTitle>
                                <R.CategoryIcon name='chevron-down' />
                            </R.Category>

                        </R.InputContainer>

                        {/* @ts-ignore */}
                        <R.BtnContainer>
                            <R.BtnDelete onPress={() => handleDeleteTransaction()}>
                                <R.IconBtn name='trash' />
                                <R.TextDelete>Deletar</R.TextDelete>
                            </R.BtnDelete>

        <R.BtnSubmit onPress={handleSubmit(handleEdit as unknown as SubmitHandler<FieldValues>)}>
                                <R.IconBtn name='save' />
                                <R.TextSubmit>Salvar</R.TextSubmit>
                            </R.BtnSubmit>
                        </R.BtnContainer>
                    </R.Body>

                    <Modal visible={modalCategory}>
                        <CategorySelect
                            category={category}
                            setCategory={setCategory}
                            closeSelectCategory={handleCloseCategoryModal}
                        />
                    </Modal>
            </R.Container>
        </KeyboardAvoidingView>
    )
}
