import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // Certifique-se de que você importou corretamente o Firestore e o Storage
import './Feed.css';

const Feed = () => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem, setImagem] = useState(null);
    const [publicacoes, setPublicacoes] = useState([]);

    useEffect(() => {
        // Buscando publicações do Firestore
        const unsubscribe = db.collection('publicacoes')
            .orderBy('createdAt', 'desc') // Ordena por data de criação, mais recentes primeiro
            .onSnapshot(snapshot => {
                const publicacoesData = [];
                snapshot.forEach(doc => publicacoesData.push({ id: doc.id, ...doc.data() }));
                setPublicacoes(publicacoesData);
            });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let imageUrl = '';
            if (imagem) {
                // Upload da imagem para o Firebase Storage
                const imageRef = storage.ref().child(`images/${imagem.name}`);
                await imageRef.put(imagem);
                imageUrl = await imageRef.getDownloadURL();
            }

            // Salvando publicação no Firestore
            await db.collection('publicacoes').add({
                titulo: titulo,
                descricao: descricao,
                imagem: imageUrl,
                createdAt: new Date()
            });

            // Limpando campos do formulário após o envio
            setTitulo('');
            setDescricao('');
            setImagem(null);
        } catch (error) {
            console.error('Erro ao salvar publicação:', error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImagem(e.target.files[0]);
        }
    };

    return (
        <div className='container-feed'>
            <h1 style={{ textAlign: 'center' }}>Feed</h1>
            <div className='container-feed-publicar'>
                <form onSubmit={handleSubmit}>
                    <label>Título da Publicação</label>
                    <input
                        type="text"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <label>Descrição de Publicação</label>
                    <textarea
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    <label>Imagem:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button type="submit">Publicar</button>
                </form>
            </div>
            <div className='container-feed-publis'>
                <h1>Últimas Publicações</h1>
                <ul>
                    {publicacoes.map(publicacao => (
                        <li key={publicacao.id}>
                            <h2>{publicacao.titulo}</h2>
                            <p>{publicacao.descricao}</p>
                            {publicacao.imagem && <img src={publicacao.imagem} alt="Publicação" style={{ width: '100%', maxHeight: '400px' }} />}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Feed;
