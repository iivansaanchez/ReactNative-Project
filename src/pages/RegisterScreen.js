import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/Firebase'; 

export function RegisterScreen() {
  //En este caso creamos un estado que almacena un objeto con los datos que puede obtener del formulario de registro
  const [form, setForm] = useState({
    nick: '',
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    password: '',
  });

  //Maneja los cambios en los campos del formulario y actualiza el estado
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    // Creamos un objeto con los datos del formulario
    const { email, password, nick, name, lastName1, lastName2 } = form;
  
    // Condicional que verifica que todos los campos sean obligatorios
    if (!email || !password || !nick || !name || !lastName1 || !lastName2) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    
  
    // Si pasa el condicional, creamos una variable que almacene los dos apellidos concatenados
    const apellidos = `${lastName1} ${lastName2}`;
    const nombre = name;
    // También almacenamos por defecto una imagen de perfil en Cloudinary
    const profile_picture = "https://res.cloudinary.com/dr1zlgrdy/image/upload/v1737805087/ImagenDefectoPerfil_jqk3l7.webp";
  
    try {
      // Usamos el auth de Firebase para crear un usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Enviamos un mensaje de alerta tipo pop up que verifique el inicio de sesión del usuario
      Alert.alert('Registro exitoso', 'Usuario creado correctamente');
      
      // Obtenemos el uid del usuario
      const user_id = userCredential.user.uid;
      
      // Creamos el objeto usuario que vamos a enviar a la base de datos
      const user = {nick, user_id, nombre, apellidos, profile_picture};
  
      // Enviamos los datos a la base de datos
      await connectWithBackend(user);
      Alert.alert('Éxito', 'Usuario guardado en la base de datos');
    } catch (error) {
      // Capturamos cualquier error que ocurra en el proceso
      Alert.alert('Error', error.message);
    }
  };
  

  //Metodo de union con la base de datos
  const connectWithBackend = async (data) =>{
    try{
      const response = await fetch('http://192.168.0.24:8080/proyecto01/users',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if(!response.ok){
        throw new Error('Error sending data');
      }
      const responseData = await response.json();
      console.log('Backend response:', responseData);
    }catch(error){
      console.error('Error sending user data',error);
    }
  }
  //ScrollView nos permite que el contenido de dentro de este se pueda desplazar hacia abajo ne caso necesario
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/formulario.png')} 
          style={styles.image}
        />
      </View>

      <Text style={styles.title}>Completar los siguientes campos:</Text>

      <TextInput
        style={styles.input}
        placeholder="Introduzca su nick"
        placeholderTextColor="#aaa"
        value={form.nick}
        onChangeText={(value) => handleInputChange('nick', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su nombre"
        placeholderTextColor="#aaa"
        value={form.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su primer apellido"
        placeholderTextColor="#aaa"
        value={form.lastName1}
        onChangeText={(value) => handleInputChange('lastName1', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su segundo apellido"
        placeholderTextColor="#aaa"
        value={form.lastName2}
        onChangeText={(value) => handleInputChange('lastName2', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su correo electrónico"
        placeholderTextColor="#aaa"
        value={form.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su contraseña"
        placeholderTextColor="#aaa"
        value={form.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>FINALIZAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200, 
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    color: '#70c100',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    color: '#fff',
    padding: 10,
    marginVertical: 10,
  },
  submitButton: {
    width: '80%',
    backgroundColor: '#70c100',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
