import React, { useState, useEffect } from 'react';
import { auth, db, provider } from '../firebase';
import './Cadastro.css';

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                window.location.href = '/feed';
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem");
            return;
        }
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
            const user = userCredential.user;

            await db.collection('users').doc(user.uid).set({
                nome: nome,
                email: email,
            });

            alert("Usuário cadastrado com sucesso!");
            window.location.href = '/feed';
        } catch (error) {
            alert("Erro ao cadastrar usuário: " + error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await auth.signInWithPopup(provider);
            const user = result.user;

            // Verifica se o usuário já existe no Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists) {
                // Se o usuário não existir, salve os dados
                await db.collection('users').doc(user.uid).set({
                    nome: user.displayName,
                    email: user.email,
                });
            }

            alert("Login com Google realizado com sucesso!");
            window.location.href = '/feed';
        } catch (error) {
            alert("Erro ao logar com Google: " + error.message);
        }
    };

    return (
        <div className='container-cadastro'>
            <h1>Cadastro</h1>
            <form onSubmit={handleSubmit}>
                <label>Nome:</label>
                <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} required />
                <label>Email:</label>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Senha:</label>
                <input type='password' value={senha} onChange={(e) => setSenha(e.target.value)} required />
                <label>Confirmar Senha:</label>
                <input type='password' value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
                <button onClick={handleGoogleLogin} className='container-cadastro-button-menor'>Login com Google</button>
                <button type="submit" className='container-cadastro-button-full'>Cadastrar</button>
            </form>
        </div>
    );
};

export default Cadastro;
