import React from "react";
import { FlatList } from "react-native";
import { categories } from "../../../utils/categories";
import * as C from './styles';

interface Category {
    key: string;
    name: string;
}

interface CategorySelectProps {
    category: Category;
    setCategory: (category: Category) => void;
    closeSelectCategory: () => void;
}

export function CategorySelect({category, closeSelectCategory, setCategory}:CategorySelectProps) {

    function handleCategorySelect (category: Category) {
        setCategory(category)
    }

    return(
        <C.Container>
            <C.Header>
                <C.Title>Categoria</C.Title>
            </C.Header>

            <FlatList 
                data={categories}
                style={{flex:1, width:'100%'}}
                keyExtractor={(item) => item.key}
                renderItem={({item}) => (
                    <C.Category
                        onPress={() => handleCategorySelect(item)}
                        isActive={category.key === item.key}
                    >
                        <C.Icon name={item.icon} />
                        <C.Label>{item.name}</C.Label>
                    </C.Category>
                )}
                ItemSeparatorComponent={() => <C.Separator/>}
            />

            <C.Footer>
                <C.Button onPress={closeSelectCategory}>
                    <C.FooterTitle>Selecionar</C.FooterTitle>
                </C.Button>
            </C.Footer>
        </C.Container>
    )
}