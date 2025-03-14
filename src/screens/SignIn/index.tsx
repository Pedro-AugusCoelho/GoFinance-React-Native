import React from "react";
import * as S from './styles';

import { useNavigation } from "@react-navigation/native";

import LogoSvg from '../../assets/logo.svg';
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../hooks/auth";

import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, Controller, FieldValues, useForm } from "react-hook-form";
import { propsStack } from "../../routes/stack.routes";

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigátorio')
})

interface FormData {
    name:string;
}

export function SignIn () {
    const navigation: propsStack = useNavigation()

    const { createUser } = useAuth()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schema)
    })

    const formControl = control as unknown as Control<FieldValues, any>

    function handleSignIn(form: FormData) {
        createUser(form)
        navigation.navigate('Home')
    }

    return(
        <>
            {/* @ts-ignore */}
            <S.Container>
                {/* @ts-ignore */}
                <S.Header>
                    {/* @ts-ignore */}
                    <S.TitleWrapper>
                        <LogoSvg 
                            width={RFValue(120)}
                            height={RFValue(68)}
                        /> 

                        <S.Title>Controle suas finanças de forma muito simples</S.Title>
                    </S.TitleWrapper>

                    <S.ContainerAccessInfo>
                        {/* @ts-ignore */}
                        <S.AccessInfo>Acesse informando seu nome</S.AccessInfo>
                    </S.ContainerAccessInfo>
                </S.Header>

                <S.Footer>
                    {/* @ts-ignore */}
                    <S.Float>
                        <Controller
                            name='name'
                            control={formControl}
                            render={({ field: { onChange, value} }) => (
                                <S.Input
                                    value={value}
                                    keyboardType="default"
                                    placeholder="NOME"
                                    onChangeText={onChange}
                                    autoCapitalize='sentences'
                                    autoCorrect={false}
                                />
                            )}
                        />
                        
                        <S.BtnSignIn onPress={handleSubmit(handleSignIn)}>
                            {/* @ts-ignore */}
                            <S.TitleSignIn>Criar</S.TitleSignIn>
                        </S.BtnSignIn>
                    </S.Float>
                </S.Footer>
            </S.Container>
        </>
    )
}