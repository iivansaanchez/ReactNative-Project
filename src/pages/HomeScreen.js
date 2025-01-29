import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'


export function HomeScreen() {
  
  const apiURL = `http://192.168.0.24:8080`;
  const [ posts, setPosts ] = useState([]);
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  
  // Usamos useEffect para hacer la llamada a la API cuando se monte el componente
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiURL}/proyecto01/publicaciones`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
      }
    };
  
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiURL}/proyecto01/users/name`);
        const data = await response.json();
        
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
  
    const fetchData = async () => {
      await Promise.all([fetchPosts(), fetchUsers()]);
      setLoading(false);
    };
  
    fetchData();
  }, []);

  const getPostWithUserNames = () => {
    return posts.map((post) => {
      const user = Array.isArray(users)
      ? users.find((u) => {
        return String(u.user_id).trim() === String(post.user_id).trim();
      })
    : null;
      return {
        ...post,
        nombre: user ? user.nombre : 'Usuario desconocido',
      };
    });
  };
  
  //Calcular días desde la publicación
const getDaysAgo = (createdAt) => {
  const currentDate = new Date();
  const createdDate = new Date(createdAt);

  const diffInTime = currentDate.getTime() - createdDate.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

  return diffInDays;
};

  // Componente Megusta
  const LikeButton = ({ item }) => {
    const [liked, setLiked] = useState(false);
    return (
      <TouchableOpacity
        style={styles.contLike}
        onPress={() => setLiked(!liked)}
      >
        <Image
          source={require("../../assets/me_gusta.png")}
          style={[styles.like, { tintColor: liked ? '#9FC63B' : '#DFDFDF' }]}
        />
        <Text style={styles.titleLike}>{item.likes} Me gusta</Text>
      </TouchableOpacity>
    );
  };

  // Renderizar cada item en el FlatList
  const renderItem = ({ item }) => {
    const daysAgo = getDaysAgo(item.createdAt); 
    return (
    <View style={styles.container}>
      <View style={styles.contHeader}>
        <Image
          source={require('../../assets/cabecera_logo_home.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.contPubli}>
        <ImageBackground
          source={{ uri: item.image_url }} 
          style={styles.publicationImage}
        >
        <View style={styles.contHeaderPubli}>
          <View style={styles.avatarBase}>
            <Image
              source={require('../../assets/foto_usuario.png')}
              style={styles.avatar}
            />
          </View>
          <View style={styles.texts}>
            <Text style={styles.title2}>Publicado por</Text>
            <Text style={styles.title3}>{item.nombre}</Text>
          </View>
        </View>
        </ImageBackground>
      </View>
  
      <View style={styles.body}>
        <LikeButton item={item} />
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.titleDescription}>{item.comentario}</Text>
        <Text style={styles.titleTime}>Hace {daysAgo} días</Text>
      </View>
    </View>
  );
};

  // Si los datos están cargando, mostramos un indicador de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color='#9FC63B' />
      </View>
    );
  }

  return (
    <FlatList
      //Coge los datos, los renderiza y los identifica por id
      data={getPostWithUserNames()}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()} 
      showsVerticalScrollIndicator={false} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
  },
  contHeader: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  contHeaderPubli: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    paddingLeft: 20,
    gap: 20,
  },
  contPubli: {
    height: 380,
    width: '100%',
  },
  return: {
    height: 30,
    width: 18,
  },
  title2: {
    color: '#DFDFDF',
    fontSize: 10,
  },
  title3: {
    color: '#DFDFDF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  avatarBase: {
    width: 50,
    height: 50,
    backgroundColor: '#9FC63B',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  texts: {
    flexDirection: 'column',
  },
  publicationImage: {
    width: '100%',
    height: 380,
    marginBottom: 10,
  },
  body: {
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
  },
  contLike: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  like: {
    width: 20,
    height: 20,
  },
  titleLike: {
    color: '#DFDFDF',
  },
  title: {
    color: '#9FC63B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  titleDescription: {
    color: '#DFDFDF',
    marginBottom: 10,
  },
  titleTime: {
    color: '#DFDFDF',
    fontSize: 8,
    marginBottom: 20,
  },
  addComment: {
    width: 50,
    height: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});