import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

import * as P from './styles'

import * as ImagePicker from 'expo-image-picker'

import { useAuth } from "../../hooks/auth"
import { useForm, Control, FieldValues, Controller } from "react-hook-form"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { createBackup } from "../../storage/backup/createBackup"
import { restoreBackup } from "../../storage/backup/restoreBackup"

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
})

interface FormData {
    name: string
}

export function Profile() {
    const { user, savePhotoProfile, editUser } = useAuth()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        // @ts-ignore
        resolver: yupResolver(schema),
    })
    const formControl = control as unknown as Control<FieldValues, any>

    useFocusEffect(useCallback(() => {
        getDataUser()
    },[]))

    useEffect(() => {
        getDataUser()
    }, [])

    function getDataUser () {
        if (user && user.photo) {
            reset({ name: user.name })
        } 
    }

    async function handlePickImage () {
        // SOLICITA PERMISSÃO PARA ACESSAR A GALERIA SOMENTE QUANDO O BOTÃO FOR PRESSIONADO
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        
        if (status !== 'granted') {
            alert('Precisamos de permissão para acessar suas fotos!')
            return
        }
        
        // SE A PERMISSÃO FOR CONCEDIDA, ABRE A GALERIA
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            // @ts-ignore
            const uri = result.assets ? result.assets[0].uri : result.uri

            await savePhotoProfile(uri)
        }
    }

    async function handleEditProfile(form: FormData) {
        const dataUser = {
            id: user!.id,
            name: form.name,
        }

        await editUser(dataUser)
    }

    async function handleCreateBackup () {
        const returnBackup = await createBackup()

        console.log(returnBackup)
    }

    async function handleRestoreBackup () {
        const returnRestoreBackup = await restoreBackup()
        // TODO - AJUSTAR P RESTORE
        console.log(returnRestoreBackup)
    }
        
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* @ts-ignore */}
            <P.Container>
                {/* @ts-ignore */}
                <P.Header>
                    {/* @ts-ignore */}
                    <P.Title>Perfil</P.Title>
                </P.Header>

                {/* @ts-ignore */}
                <P.Body>            
                    {/* @ts-ignore */}
                    <P.InputContainer>
                        <P.ImageCenter>
                            {/* @ts-ignore */}
                            <P.ImageContainer>
                                {/* @ts-ignore */}
                                <P.SelectImageIcon onPress={handlePickImage}>
                                    <P.Icon name="camera" />
                                </P.SelectImageIcon>
                                
                                <>
                                    { user!.photo && <P.Image source={{ uri: user!.photo }}/> }
                                </>
                            </P.ImageContainer>
                        </P.ImageCenter>

                        <Controller
                            name='name'
                            control={formControl}
                            render={({ field: { onChange, value } }) => (
                                <P.Input
                                    value={value}
                                    keyboardType="default"
                                    placeholder="Nome"
                                    onChangeText={onChange}
                                    autoCapitalize='sentences'
                                    autoCorrect={false}
                                />
                            )}
                        />
                        {errors.name && <P.Error>{errors.name.message}</P.Error>}

                        <P.Btn onPress={handleSubmit(handleEditProfile)}>
                            {/* @ts-ignore */}
                            <P.TitleBtn>Alterar Nome</P.TitleBtn>
                        </P.Btn>

                        <P.Btn onPress={handleCreateBackup}>
                            {/* @ts-ignore */}
                            <P.TitleBtn>Criar Arquivo de Backup</P.TitleBtn>
                        </P.Btn>

                        <P.Btn onPress={handleRestoreBackup}>
                            {/* @ts-ignore */}
                            <P.TitleBtn>Restaurar Backup do Arquivo</P.TitleBtn>
                        </P.Btn>

                    </P.InputContainer>
                </P.Body>
            </P.Container>
        </TouchableWithoutFeedback>
    )
}