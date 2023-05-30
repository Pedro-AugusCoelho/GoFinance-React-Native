import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, Controller, FieldValues, useForm } from "react-hook-form";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { CategorySelect } from "../CategorySelect";
import * as R from './styles';
import { propsBottomTab } from "../../routes/app.routes";

interface FormData {
    name:string;
    amount:string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigátorio'),
    amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('Informe somente valores positivos')
    .required('Preço é obrigátorio')
})

export function Register() {
    const navigation: propsBottomTab = useNavigation();
    const dataKey = '@gofinances:transactions';
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schema)
    });
    const formControll = control as unknown as Control<FieldValues, any>

    const [transactionType, setTransactionType] = useState<'income' | 'outcome' | ''>('');
    const [modalCategory, setModalCategory] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    function handleOpenCategoryModal() {
        setModalCategory(true)
    }

    function handleCloseCategoryModal() {
        setModalCategory(false)
    }

    async function handleRegister (form: FormData) {
        if(category.key === 'category')
            Alert.alert('Selecione a categoria')
        if(!transactionType)
            Alert.alert('Selecione o tipo da transação')


        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];
            const dataFormatted = [
                ...currentData,
                newTransaction
            ]
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });
            
            navigation.navigate('Listagem');

        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível salvar')
        }
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <R.Container>
                <R.Header>
                    <R.Title>Cadastro</R.Title>
                </R.Header>

                <R.Body>
                    <R.InputContainer>

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
                            name='amount'
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
                        { errors.amount && <R.Error>{ errors.amount.message }</R.Error> }

                        <R.BoxBtn>
                            <R.BtnSelected onPress={() => setTransactionType('income')} isActive={transactionType === 'income'} type={transactionType}>
                                <R.Icon name='arrow-up-circle' type='income'/>
                                <R.TextBtn>Income</R.TextBtn>
                            </R.BtnSelected>

                            <R.BtnSelected onPress={() => setTransactionType('outcome')} isActive={transactionType === 'outcome'} type={transactionType}>
                                <R.Icon name='arrow-down-circle' type='outcome'/>
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