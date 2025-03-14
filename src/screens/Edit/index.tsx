import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, Controller, FieldValues, useForm } from "react-hook-form";
import { Alert, Keyboard, Modal, Platform, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import * as R from './styles';
import { CategorySelect } from "../CategorySelect";
import { editRouteProp, propsStack } from "../../routes/stack.routes";
import { categories } from "../../../utils/categories";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionDTO } from "../../storage/transaction/transactionStorageDTO";

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
    const navigation: propsStack = useNavigation()
    
    const route = useRoute<editRouteProp>();
    
    const { params } = route;
    
    const dataKey = '@gofinances:transactions';
    
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
    const [transactionType, setTransactionType] = useState<'income' | 'outcome' | ''>('');
    const [modalCategory, setModalCategory] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });
    const [showDatePicker, setShowDatePicker] = useState(false)

    useEffect(() => {
        async function handleFindParameter() {
         const data = await AsyncStorage.getItem(dataKey);
         const currentData = data ? JSON.parse(data) : [];
         const located: TransactionDTO = currentData.find((item:{id: string})  => item.id === params.id)
 
         if (located) {
             const findCategory = categories.find(item => item.key === located.category)
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
        if(category.key === 'category')
            Alert.alert('Selecione a categoria')
        if(!transactionType)
            Alert.alert('Selecione o tipo da transação')


        const editTransaction = {
            id: id,
            name: form.name,
            value: form.value,
            type: transactionType,
            category: category.key,
            date: date
        }

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData: TransactionDTO[] = data ? JSON.parse(data) : [];
            const filterData = currentData.filter(item => item.id !== params.id)

            const dataFormatted = [
                 ...filterData,
                 editTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });

            navigation.push('Home')

        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível salvar')
        }
    }

    async function handleDeleteTransaction () {
        const data = await AsyncStorage.getItem(dataKey);
        const currentData: TransactionDTO[] = data ? JSON.parse(data) : [];
        const filterData = currentData.filter(item => item.id !== params.id)

        await AsyncStorage.setItem(dataKey, JSON.stringify(filterData))

        navigation.push('Home')
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                        display="default"
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
                                    <R.TextBtn>Income</R.TextBtn>
                                </R.BtnSelected>

                                {/* @ts-ignore */}
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

                        {/* @ts-ignore */}
                        <R.BtnContainer>
                            <R.BtnDelete onPress={() => handleDeleteTransaction()}>
                                <R.IconBtn name='trash' />
                                <R.TextDelete>Deletar</R.TextDelete>
                            </R.BtnDelete>

                            <R.BtnSubmit onPress={handleSubmit(handleEdit)}>
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
        </TouchableWithoutFeedback>
    )
}