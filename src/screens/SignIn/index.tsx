import React from "react";
import * as S from './styles';

import LogoSvg from '../../assets/logo.svg';
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../../hooks/auth";

import { Control, Controller, FieldValues, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

const schema = Yup.object().shape({
    email: Yup
    .string()
    .required('Nome é obrigátorio'),
    password: Yup
    .string()
    .required('Senha é obrigátoria')
})

interface FormData {
    email:string;
    password:string;
}

export function SignIn () {

    const { signIn } = useAuth();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schema)
    });
    const formControll = control as unknown as Control<FieldValues, any>

    function handleSignIn(form: FormData) {
        signIn(form)
    }

    return(
        <S.Container>
            <S.Header>
                <S.TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    /> 

                    <S.Title>Controle suas finanças de forma muito simples</S.Title>
                </S.TitleWrapper>

                <S.ContainerAccessInfo>
                    <S.AccessInfo>Faça seu login com email e senha</S.AccessInfo>
                </S.ContainerAccessInfo>
            </S.Header>

            <S.Footer>
                <S.Float>
                    
                    <Controller
                        name='email'
                        control={formControll}
                        render={({ field: { onChange, value} }) => (
                            <S.Input
                                value={value}
                                keyboardType="default"
                                placeholder="Email"
                                onChangeText={onChange}
                                autoCapitalize='sentences'
                                autoCorrect={false}
                            />
                        )}
                    />

                    <Controller
                        name='password'
                        control={formControll}
                        render={({ field: { onChange, value} }) => (
                            <S.Input
                                value={value}
                                keyboardType="default"
                                secureTextEntry={true}
                                placeholder="Senha"
                                onChangeText={onChange}
                                autoCapitalize='sentences'
                                autoCorrect={false}
                            />
                        )}
                    />
                    
                    <S.BtnSignIn onPress={handleSubmit(handleSignIn)}>
                        <S.TitleSignIn>Entrar</S.TitleSignIn>
                    </S.BtnSignIn>
                </S.Float>
            </S.Footer>
        </S.Container>
    )
}