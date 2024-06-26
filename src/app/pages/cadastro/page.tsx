"use client";
import { useForm } from "react-hook-form";
import styles from './styles.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { api } from "@/app/services/api";
import Link from 'next/link'
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";


interface CadastroFormulario {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    moedas: number;
}

const CadastroFormularioSchema = z.object({
    nome: z
        .string()
        .min(1, { message: "O campo é obrigatório" })
        .max(100, { message: "Campo inválido" }),
    email: z
        .string()
        .min(1, { message: "O campo é obrigatório" })
        .email("Insira um e-mail válido"),

    senha: z
        .string()
        .min(1, { message: "O campo é obrigatório" }),

    confirmarSenha: z
        .string()
        .min(1, { message: "Confirme sua senha" })
}).refine(data => data.senha === data.confirmarSenha, {
    message: "As senhas devem ser iguais",
    path: ["confirmarSenha"], // path of error
});

const Cadastro: React.FC = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<CadastroFormulario>({
        resolver: zodResolver(CadastroFormularioSchema)
    });
    const toast = useToast();
    const router = useRouter();


    async function enviarFormulario(cadastroFormulario: CadastroFormulario) {
        console.log("RECEBI OS DADOS", cadastroFormulario);

        try {

            cadastroFormulario.moedas = 100;

            const response = await api.post('usuarios/create', cadastroFormulario);

            const result = await response.data;

            toast({
                title: "Cadastro",
                description: "Cadastro realizado com sucesso!",
                status: "success",
                duration: 9000,
                isClosable: true,
            });

            router.push("/pages/login");
        }
        catch (error: any) {
            toast({
                title: "Cadastro",
                description: "Erro ao realizar cadastro, verifique os dados inseridos e tente novamente",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const FormInput = ({ name, register, errors, ...rest }: any) => (
        <div className="form_control">
            <input {...register(name)} {...rest} />
            {errors[name] && <span className={styles.error_message}>{errors[name].message}</span>}
        </div>
    );
    return (
        <>
            <main className={styles.container}>
                <div className={styles.machine}>
                    <div className={styles.screen}>
                        <div className={styles.menu}></div>

                        <form className={styles.form_cadastro} onSubmit={handleSubmit(enviarFormulario)}>
                            <label className={styles.label_cadastro}>CADASTRO</label>

                            <input {...register('nome')} placeholder="Nome do Usuário" className={styles.input_cadastrar} />
                            {errors?.nome?.message && <span className={styles.error_message}>{errors?.nome?.message}</span>}

                            <input {...register('email')} placeholder="Email do Usuário" className={styles.input_cadastrar} />
                            {errors?.email?.message && <span className={styles.error_message}>{errors?.email?.message}</span>}

                            <input {...register('senha')} placeholder="Senha" className={styles.input_cadastrar} type="password" />
                            {errors?.senha?.message && <span className={styles.error_message}>{errors?.senha?.message}</span>}

                            <input {...register('confirmarSenha')} placeholder="Confirmar senha" className={styles.input_cadastrar} type="password" />
                            {errors?.confirmarSenha?.message && <span className={styles.error_message}>{errors?.confirmarSenha?.message}</span>}

                            <div className={styles.buttons}>
                                <button className={styles.button_salvar}>SALVAR</button>
                                <Link href="/pages/login" className={styles.button_salvar}>VOLTAR</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Cadastro;
