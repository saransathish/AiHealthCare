// screens/Home.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const floatAnimation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const renderPrincipleCard = (title: string, description: string, iconName: string) => (
    <View style={styles.principleCard}>
      <View style={styles.principleIconContainer}>
        <Icon name={iconName} size={32} color="#0035B0" />
      </View>
      <Text style={styles.principleTitle}>{title}</Text>
      <Text style={styles.principleText}>{description}</Text>
    </View>
  );

  const renderTeamMember = (name: string, role: string, description: string) => (
    <View style={styles.teamCard}>
      <Text style={styles.teamName}>{name}</Text>
      <Text style={styles.teamRole}>{role}</Text>
      <Text style={styles.teamDescription}>{description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#010954', '#1a6eed']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            A Common Platform For Personalized Healthcare Information
          </Text>
          <Text style={styles.headerText}>
            Robust and well-developed technology interlinking experienced doctors, trusted clinics,
            certified pharmacies, labs and patients to ease the process of healthcare.
          </Text>
        </View>
        <ImageBackground
          source={require('../images/home2.jpg')}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </LinearGradient>

      <View style={styles.content}>
        <ImageBackground
          source={require('../images/home-content.png')}
          style={styles.contentImage}
          resizeMode="cover"
        />
        <View style={styles.contentTextContainer}>
          <Text style={styles.contentTitle}>Introducing AI Healthcare</Text>
          <Text style={styles.contentSubtitle}>A Cloud-based Healthcare Platform</Text>
          <Text style={styles.contentText}>
            SmartCare is developed to digitalize and simplify the task of integrating 
            everything related to Healthcare, including medical, clinical & pharmaceutical 
            procurement and maintenance of records.
          </Text>
        </View>
      </View>

      <View style={styles.principlesContainer}>
        {renderPrincipleCard(
          'Vision',
          'Our vision is to provide the best technologies to healthcare clinics and help society to improve their quality of life.',
          'eye-outline'
        )}
        {renderPrincipleCard(
          'Mission',
          'Our mission is to grow our business by using innovation, creativity and the best skills to improve patient health.',
          'target'
        )}
        {renderPrincipleCard(
          'Philosophy',
          'We believe in delivering effective and accurate healthcare with a commitment to offering innovative and creative products.',
          'lightbulb-outline'
        )}
      </View>

      <LinearGradient
        colors={['#0052CD', '#1a6eed']}
        style={styles.divider}
      >
        <Text style={styles.dividerText}>
          Making Healthcare Easily Accessible For You
        </Text>
      </LinearGradient>

      <View style={styles.teamContainer}>
        {renderTeamMember(
          'SARAN',
          'Founder',
          'An enthusiastic, confident, and multi-skilled professional with expertise in AWS and Software development.'
        )}
        {renderTeamMember(
          'MANOJ KUMAR',
          'Co-founder',
          'An enthusiastic professional with expertise in AWS and Software development.'
        )}
        {renderTeamMember(
          'BALAJI',
          'Co-founder',
          'An enthusiastic professional with expertise in AWS and Software development.'
        )}
      </View>

      <Animated.View
        style={[
          styles.chatButtonContainer,
          {
            transform: [{
              translateY: floatAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <LinearGradient
            colors={['#2563eb', '#7c3aed']}
            style={styles.chatButtonGradient}
          >
            <Icon name="chat" size={30} color="white" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>Let's Chat!</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerContent: {
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  headerImage: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  contentImage: {
    height: 200,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  contentTextContainer: {
    padding: 15,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003FB7',
    marginBottom: 10,
  },
  contentSubtitle: {
    fontSize: 20,
    color: '#003FB7',
    marginBottom: 15,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  principlesContainer: {
    padding: 20,
  },
  principleCard: {
    backgroundColor: '#f5f7fb',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  principleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6ebf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  principleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0035B0',
    marginBottom: 10,
  },
  principleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  divider: {
    padding: 20,
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  teamContainer: {
    padding: 20,
  },
  teamCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0035B0',
    marginBottom: 5,
  },
  teamRole: {
    fontSize: 18,
    color: '#0035B0',
    marginBottom: 10,
  },
  teamDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  chatButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  chatButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    position: 'absolute',
    right: 70,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    padding: 8,
    borderRadius: 8,
    bottom: 10,
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Home;