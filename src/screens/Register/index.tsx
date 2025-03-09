import React, { useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'
import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { Control, Controller, FieldValues, useForm } from "react-hook-form"
import { Modal, TouchableWithoutFeedback, Keyboard, Alert, Button, Platform, Text, TouchableOpacity } from "react-native"
import { useNavigation } from '@react-navigation/native'

import { CategorySelect } from "../CategorySelect"
import * as R from './styles'
import { propsBottomTab } from "../../routes/app.routes"

import DateTimePicker from "@react-native-community/datetimepicker"

interface FormData {
    name: string
    value: string
    amount: string
    date: Date
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    value: Yup.number()
        .typeError('Informe um valor numérico')
        .positive('Informe somente valores positivos')
        .required('Preço é obrigatório'),
    amount: Yup.number()
        .typeError('Informe a quantidade de parcelas')
        .positive('Informe somente valores positivos')
        .required('Quantidade de parcelas é obrigatória'),
})

export function Register() {
    const navigation: propsBottomTab = useNavigation()
    const dataKey = '@gofinances:transactions'
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            amount: '1',
        }
    })
    const formControl = control as unknown as Control<FieldValues, any>

    const [transactionType, setTransactionType] = useState<'income' | 'outcome' | ''>('')
    const [modalCategory, setModalCategory] = useState(false)
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const [showDatePicker, setShowDatePicker] = useState(false)
    const [date, setDate] = useState(new Date())

    function handleOpenCategoryModal() {
        setModalCategory(true)
    }

    function handleCloseCategoryModal() {
        setModalCategory(false)
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
    
        const totalValue = Number(form.value);
        const installments = Number(form.amount);
    
        if (installments < 1) {
            Alert.alert('A quantidade de parcelas deve ser maior que zero');
            return;
        }
    
        const installmentValue = totalValue / installments; // Divide o valor total pelo número de parcelas
    
        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];
    
            const newTransactions = [];
            let transactionDate = new Date(date); // Usa a data informada como base
    
            for (let i = 0; i < installments; i++) {
                const newTransaction = {
                    id: String(uuid.v4()),
                    name: `${form.name} - ${String(i + 1).padStart(2, '0')}/${installments}`,
                    value: installmentValue.toFixed(2),
                    amount: installments,
                    type: transactionType,
                    category: category.key,
                    date: transactionDate.toISOString(),
                };
    
                newTransactions.push(newTransaction);
    
                // Avança para o próximo mês
                transactionDate.setMonth(transactionDate.getMonth() + 1);
            }
    
            const dataFormatted = [...currentData, ...newTransactions];
    
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
    
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });
            setDate(new Date());
    
            navigation.navigate('Listagem');
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar');
        }
    }
    

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <R.Container>
                <R.Header>
                    <R.Title>Cadastro</R.Title>
                </R.Header>

                <R.Body>
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
                            render={({ field: { onChange, value } }) => (
                                <R.Input
                                    value={value}
                                    keyboardType="numeric"
                                    placeholder="Valor Total"
                                    onChangeText={onChange}
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
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const currentDate = selectedDate || date
                                        setShowDatePicker(Platform.OS === 'ios')
                                        setDate(currentDate)
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                        

                        <R.BoxBtn>
                            <R.BtnSelected onPress={() => setTransactionType('income')} isActive={transactionType === 'income'} type={transactionType}>
                                <R.Icon name='arrow-up-circle' type='income' />
                                <R.TextBtn>Income</R.TextBtn>
                            </R.BtnSelected>

                            <R.BtnSelected onPress={() => setTransactionType('outcome')} isActive={transactionType === 'outcome'} type={transactionType}>
                                <R.Icon name='arrow-down-circle' type='outcome' />
                                <R.TextBtn>Outcome</R.TextBtn>
                            </R.BtnSelected>
                        </R.BoxBtn>

                        <R.Category onPress={handleOpenCategoryModal}>
                            <R.CategoryTitle>{category.name}</R.CategoryTitle>
                            <R.CategoryIcon name='chevron-down' />
                        </R.Category>
                    </R.InputContainer>

                    <R.BtnSubmit onPress={handleSubmit(handleRegister)}>
                        <R.TextSubmit>Enviar</R.TextSubmit>
                    </R.BtnSubmit>
                </R.Body>

                <Modal visible={modalCategory}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseCategoryModal}
                    />
                </Modal>
            </R.Container>
        </TouchableWithoutFeedback>
    )
}
