import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

import * as P from './styles'

import * as ImagePicker from 'expo-image-picker'

import { useAuth } from "../../hooks/auth"
import { useForm, Control, FieldValues, Controller } from "react-hook-form"
import { Keyboard, Alert, ActivityIndicator, Switch, KeyboardAvoidingView, Platform } from "react-native"
import { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { createBackup } from "../../storage/backup/createBackup"
import { restoreBackup } from "../../storage/backup/restoreBackup"
import { useTheme } from "styled-components/native"
import { useAppTheme } from "../../hooks/theme"

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
})

interface FormData {
    name: string
}

export function Profile() {
    const { user, savePhotoProfile, editUser } = useAuth()
    const { isDark, toggleTheme } = useAppTheme()
    const theme = useTheme()
    const [isLoadingBackup, setIsLoadingBackup] = useState(false)
    const [isLoadingRestore, setIsLoadingRestore] = useState(false)

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
        Alert.alert('Sucesso', 'Nome atualizado com sucesso!')
    }

    async function handleCreateBackup () {
        setIsLoadingBackup(true)
        try {
            const result = await createBackup()

            if (result && result.success) {
                Alert.alert('Sucesso', result.message)
            } else {
                Alert.alert('Erro', result?.message || 'Erro ao criar backup')
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao criar backup')
            console.error(error)
        } finally {
            setIsLoadingBackup(false)
        }
    }

    async function handleRestoreBackup () {
        Alert.alert(
            'Confirmar Restauração',
            'Tem certeza que deseja restaurar o backup? Isto irá substituir todos os dados atuais.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Restaurar',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoadingRestore(true)
                        try {
                            const result = await restoreBackup()

                            if (result && result.success) {
                                Alert.alert('Sucesso', result.message)
                            } else {
                                Alert.alert('Erro', result?.message || 'Erro ao restaurar backup')
                            }
                        } catch (error) {
                            Alert.alert('Erro', 'Erro ao restaurar backup')
                            console.error(error)
                        } finally {
                            setIsLoadingRestore(false)
                        }
                    }
                }
            ]
        )
    }
        
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        {/* @ts-ignore */}
        <P.Container
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ flexGrow: 1 }}
        >
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
                                
                                {user!.photo ? (
                                    <P.Image source={{ uri: user!.photo }}/>
                                ) : (
                                    <P.AvatarPlaceholder>
                                        {/* @ts-ignore */}
                                        <P.AvatarText>
                                            {user!.name.charAt(0).toUpperCase()}
                                        </P.AvatarText>
                                    </P.AvatarPlaceholder>
                                )}
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

                        {/* @ts-ignore */}
                        <P.Btn onPress={handleSubmit(handleEditProfile)}>
                            {/* @ts-ignore */}
                            <P.BtnIcon name="edit-3" />
                            {/* @ts-ignore */}
                            <P.TitleBtn>Alterar Nome</P.TitleBtn>
                        </P.Btn>

                        {/* @ts-ignore */}
                        <P.Section>
                            <P.SectionTitle>Aparência</P.SectionTitle>
                            <P.ThemeRow>
                                <P.ThemeLabel>
                                    {isDark ? 'Modo escuro ativo' : 'Modo claro ativo'}
                                </P.ThemeLabel>

                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: theme.colors.text, true: theme.colors.primary }}
                                    thumbColor={theme.colors.shape}
                                />
                            </P.ThemeRow>
                        </P.Section>

                        {/* @ts-ignore */}
                        <P.Section>
                            <P.SectionTitle>Backup de Dados</P.SectionTitle>
                            
                            {/* @ts-ignore */}
                            <P.Btn onPress={handleCreateBackup} disabled={isLoadingBackup}>
                                {/* @ts-ignore */}
                                {isLoadingBackup ? (
                                    // @ts-ignore
                                    <ActivityIndicator color={theme.colors.shape} />
                                ) : (
                                    <>
                                        {/* @ts-ignore */}
                                        <P.BtnIcon name="download" />
                                        {/* @ts-ignore */}
                                        <P.TitleBtn>Exportar Backup</P.TitleBtn>
                                    </>
                                )}
                            </P.Btn>

                            {/* @ts-ignore */}
                            <P.BtnSecondary onPress={handleRestoreBackup} disabled={isLoadingRestore}>
                                {/* @ts-ignore */}
                                {isLoadingRestore ? (
                                    // @ts-ignore
                                    <ActivityIndicator color={theme.colors.primary} />
                                ) : (
                                    <>
                                        {/* @ts-ignore */}
                                        <P.BtnIconSecondary name="upload" />
                                        {/* @ts-ignore */}
                                        <P.TitleBtnSecondary>Importar Backup</P.TitleBtnSecondary>
                                    </>
                                )}
                            </P.BtnSecondary>
                        </P.Section>

                    </P.InputContainer>
                </P.Body>
            </P.Container>
        </KeyboardAvoidingView>
    )
}