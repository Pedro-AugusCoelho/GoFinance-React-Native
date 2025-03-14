import * as Yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from "@react-native-async-storage/async-storage"

import * as P from './styles'
import { useForm, Control, FieldValues, Controller } from "react-hook-form"
import { TouchableWithoutFeedback, Keyboard } from "react-native"
import { useEffect, useState } from "react"
import { getUser } from "../../storage/user/getuser"
import { setPhotoUser } from "../../storage/user/setPhotoUser"

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
})

interface FormData {
    name: string
}

export function Profile() {
    const [image, setImage] = useState<string>('')

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

    useEffect(() => {
        (async () => {
            // PEGAR O USUARIO SALVO
            const storedUser = await getUser()

            if (storedUser) {
                setImage(storedUser.photo)
                reset({ name: storedUser.name })
            }
        })()
    }, [])

    const handlePickImage = async () => {
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
            // EM VERSÕES MAIS RECENTES, O RESULTADO VEM EM RESULT.ASSETS
            const uri = result.assets ? result.assets[0].uri : result.uri
            setImage(uri)
            await setPhotoUser(uri)
        }
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
                                    { image && <P.Image source={{ uri: image }}/> }
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
                    </P.InputContainer>
                </P.Body>
            </P.Container>
        </TouchableWithoutFeedback>
    )
}