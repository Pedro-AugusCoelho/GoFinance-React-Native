import React, { useRef, useState } from "react"
import uuid from 'react-native-uuid'
import { RootTabParamList } from "../../../../app/navigation/app.routes"
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { Control, Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { ActivityIndicator, Animated, Modal, Keyboard, Alert, Platform, TouchableOpacity, FlatList, KeyboardAvoidingView } from "react-native"
import { useNavigation } from '@react-navigation/native'
import { CurrencyInput } from "../../../../shared/components/CurrencyInput"

import * as R from './styles'
import { categories } from "../../domain/categories"
import { createTransactionPlan } from '../../application/create-transaction-plan'

import DateTimePicker from "@react-native-community/datetimepicker"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { getErrorMessage } from '../../../../core/errors/app-error'

interface FormData {
    name: string
    value: number
    amount: string
    date: Date
}

interface CategoryData {
    key: string
    name: string
    icon: string
}

type TabNavigationProps = BottomTabNavigationProp<RootTabParamList>

const schema = Yup.object().shape({
    name: Yup.string().trim().required('Nome é obrigatório'),
    value: Yup.number()
        .typeError('Informe um valor numérico')
        .integer('Informe um valor válido')
        .positive('Informe somente valores positivos')
        .required('Preço é obrigatório'),
    amount: Yup.number()
        .typeError('Informe a quantidade de parcelas')
        .integer('Informe um número inteiro de parcelas')
        .positive('Informe somente valores positivos')
        .required('Quantidade de parcelas é obrigatória'),
})

export function Register() {
    const navigation: TabNavigationProps = useNavigation()
    
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        // @ts-ignore
        resolver: yupResolver(schema),
        defaultValues: {
            amount: '1',
        }
    })
    const formControl = control as unknown as Control<FieldValues, any>

    const [transactionType, setTransactionType] = useState<'income' | 'outcome' | ''>('')
    const [isSaving, setIsSaving] = useState(false)
    const incomeButtonScale = useRef(new Animated.Value(1)).current
    const outcomeButtonScale = useRef(new Animated.Value(1)).current
    const [modalCategory, setModalCategory] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const [showDatePicker, setShowDatePicker] = useState(false)
    const [date, setDate] = useState(new Date())

    function animateTypeButton(scale: Animated.Value, toValue: number) {
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            speed: 24,
            bounciness: 6,
        }).start()
    }

    function handleOpenCategoryModal() {
        setModalCategory(true)
    }

    function handleCloseCategoryModal() {
        setModalCategory(false)
    }

    function handleCategorySelect(item: CategoryData) {
        setCategory({
            key: item.key,
            name: item.name,
        })
        handleCloseCategoryModal()
    }

    async function handleRegister(form: FormData) {
        if (category.key === 'category') {
            Alert.alert('Selecione a categoria');
            return;
        }
    
        if (!transactionType) {
            Alert.alert('Selecione o tipo da transação');
            return;
        }
    
        if (!date) {
            Alert.alert('Selecione uma data');
            return;
        }
    
        const installments = Number(form.amount);

        if (!Number.isInteger(form.value) || form.value <= 0) {
            Alert.alert('Valor inválido', 'Informe um valor válido.')
            return
        }
    
        if (installments < 1) {
            Alert.alert('A quantidade de parcelas deve ser maior que zero');
            return;
        }
    
        setIsSaving(true)
        try {
            await createTransactionPlan({
                name: form.name,
                totalValueCents: form.value,
                installments,
                type: transactionType,
                category: category.key,
                date,
                createId: () => String(uuid.v4()),
            })
    
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });
            setDate(new Date());
    
            navigation.navigate('Listagem');
        } catch (error: unknown) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível salvar a transação.'))
        } finally {
            setIsSaving(false)
        }
    }
    

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        {/* @ts-ignore */}
        <R.Container
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ flexGrow: 1 }}
        >
                <R.Header>
                    {/* @ts-ignore */}
                    <R.Title>Cadastro</R.Title>
                </R.Header>

                {/* @ts-ignore */}
                <R.Body>
                    {/* @ts-ignore */}
                    <R.InputContainer>
                        <Controller
                            name='name'
                            control={formControl}
                            render={({ field: { onChange, value } }) => (
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
                        {errors.name && <R.Error>{errors.name.message}</R.Error>}

                        <Controller
                            name='value'
                            control={formControl}
                            defaultValue={0}
                            render={({ field: { onChange, value } }) => (
                                <CurrencyInput
                                    value={value}
                                    onChangeValue={onChange}
                                />
                            )}
                        />
                        {errors.value && <R.Error>{errors.value.message}</R.Error>}

                        <Controller
                            name='amount'
                            control={formControl}
                            render={({ field: { onChange, value } }) => (
                                <R.Input
                                    value={value}
                                    keyboardType="numeric"
                                    placeholder="Parcela"
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.amount && <R.Error>{errors.amount.message}</R.Error>}

                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <R.Input
                                value={date.toLocaleDateString('pt-BR')}
                                placeholder="Selecionar Data"
                                editable={false}
                            />

                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
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
                            <Animated.View style={{ flex: 1, transform: [{ scale: incomeButtonScale }] }}>
                                <R.BtnSelected
                                    onPress={() => setTransactionType('income')}
                                    onPressIn={() => animateTypeButton(incomeButtonScale, 0.96)}
                                    onPressOut={() => animateTypeButton(incomeButtonScale, 1)}
                                    isActive={transactionType === 'income'}
                                    type={transactionType}
                                >
                                    <R.Icon name='arrow-up-circle' type='income' />
                                    <R.TextBtn>Entrada</R.TextBtn>
                                </R.BtnSelected>
                            </Animated.View>

                            {/* @ts-ignore */}
                            <Animated.View style={{ flex: 1, transform: [{ scale: outcomeButtonScale }] }}>
                                <R.BtnSelected
                                    onPress={() => setTransactionType('outcome')}
                                    onPressIn={() => animateTypeButton(outcomeButtonScale, 0.96)}
                                    onPressOut={() => animateTypeButton(outcomeButtonScale, 1)}
                                    isActive={transactionType === 'outcome'}
                                    type={transactionType}
                                >
                                    <R.Icon name='arrow-down-circle' type='outcome' />
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

                    <R.BtnSubmit
                        onPress={handleSubmit(handleRegister as unknown as SubmitHandler<FieldValues>)}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <R.IconSubmit name='save' />
                                <R.TextSubmit>Salvar</R.TextSubmit>
                            </>
                        )}
                    </R.BtnSubmit>
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
                                        onPress={() => handleCategorySelect(item as CategoryData)}
                                        isActive={category.key === item.key}
                                    >
                                        <R.ModalCategoryIcon name={item.icon as React.ComponentProps<typeof R.ModalCategoryIcon>['name']} />
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
