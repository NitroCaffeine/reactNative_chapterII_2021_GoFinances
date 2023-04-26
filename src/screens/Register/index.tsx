import { useEffect, useState } from "react";
import { Button } from "../../components/Forms/Button";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { Container, Header, Title, Form, Fields, TransactionTypeFields } from "./styles";
import uuid from 'react-native-uuid';
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { Modal, TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { Category, CategorySelect } from "../CategorySelect";
import { useForm} from "react-hook-form";
import { AlertComponent } from "../../components/Alert";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { storeData } from "../../asyncStorage/storeData";
import { TransactionProps } from "../Dashboard";
import { TransactionCardProps } from "../../components/TransactionCard";
import { getData } from "../../asyncStorage/getData";

type FormData = { // devem ser os msm nomes dos names nos inputs
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um valor numérico').positive('O valor não pode ser negativo').required('O valor é obrigatório')
})



export function Register() {

    const {control, handleSubmit, formState: {errors}} = useForm<FormData | any>({
        resolver: yupResolver(schema)
    });
    const [isActiveTransactionType, setIsActiveTransactionType] = useState('');


    const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
        
    });

    const onSubmit = (data: FormData) => console.log(data);


    function handleTransactionTypeSelect(type: 'income' | 'outcome') {
        setIsActiveTransactionType(type);
    }

    function handleOpenCategorySelectModal() {
        setShowCategorySelectModal(true);
    }

    function handleCloseCategorySelectModal() {
        setShowCategorySelectModal(false);
      
        
    }

    function handleRegister(form: FormData) {

        if(!isActiveTransactionType)
            return AlertComponent({title: "", message: "Selecione o tipo da transação"});

        if(category.key === 'category') {
            return AlertComponent({title: "", message: "Selecione a categoria"});
        }

        const data = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType: isActiveTransactionType,
            category: category.key,
            date: new Date()
        
        }

        console.log(data);
        storeData(data)


    }


    useEffect(() => {

            console.log(getData())

    }, [])
   


        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1}}>
                    <Container>
                        <Header>
                        <Title>Cadastro</Title>
                        </Header>

                        <Form>
                        <Fields>
                            <InputForm
                            name="name"
                            placeholder="Nome"
                            control={control}
                            autoCapitalize="sentences"
                            error={(errors.name && errors.name.message)?.toString()}
                            />
                            <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="decimal-pad"
                            error={(errors.amount && errors.amount.message)?.toString()}
                            />
                            <TransactionTypeFields>
                            <TransactionTypeButton
                                isActive={isActiveTransactionType === "income"}
                                title="Entrada"
                                type="up"
                                onPress={() => handleTransactionTypeSelect("income")}
                            />
                            <TransactionTypeButton
                                isActive={isActiveTransactionType === "outcome"}
                                title="Saída"
                                type="down"
                                onPress={() => handleTransactionTypeSelect("outcome")}
                            />
                            </TransactionTypeFields>
                            <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenCategorySelectModal}
                            />
                        </Fields>
                        <Button
                            title="Enviar"
                            onPress={handleSubmit(handleRegister)}
                        />
                        </Form>
                        <Modal visible={showCategorySelectModal}>
                        <TouchableWithoutFeedback onPress={handleCloseCategorySelectModal}>
                            <View style={{ flex: 1 }}>
                            <CategorySelect
                                category={category}
                                setCategory={setCategory}
                                closeSelectCategory={handleCloseCategorySelectModal}
                            />
                            </View>
                        </TouchableWithoutFeedback>
                        </Modal>
                    </Container>
                    </View>
  </TouchableWithoutFeedback>
        )
}