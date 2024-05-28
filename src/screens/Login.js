import React, { useState } from 'react';
import { auth, provider, db } from '../firebase';
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await auth.signInWithEmailAndPassword(email, senha);
            alert('Login realizado com sucesso!');
            window.location.href = '/feed';
        } catch (error) {
            alert('Erro ao fazer login: ' + error.message);
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

            alert('Login com Google realizado com sucesso!');
            window.location.href = '/feed';
        } catch (error) {
            alert('Erro ao logar com Google: ' + error.message);
        }
    };

    return (
        <div className='container-login'>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Senha:</label>
                <input type='password' value={senha} onChange={(e) => setSenha(e.target.value)} required />
                <button onClick={handleGoogleLogin} className='container-login-button-menor'>Login com Google</button>
                <button type="submit" className='container-login-button-full'>Login</button>
            </form>
        </div>
    );
};

export default Login;
