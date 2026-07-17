import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Tag, Users } from 'lucide-react-native';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import { router } from 'expo-router';

interface ProjectCardProps {
  proyecto: IProyecto;
}

export function ProjectCard({ proyecto }: ProjectCardProps) {
  // Use a fallback image if none provided in model (though IProyecto doesn't have it, Figma shows one)
  // For the demo, we'll use a relevant unsplash image based on the title or a default
  const imageUrl = "https://images.unsplash.com/photo-1596700813959-1e359a39e830?q=80&w=600&auto=format&fit=crop";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/proyecto/${proyecto.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{proyecto.titulo}</Text>

        <View style={styles.infoRow}>
          <Tag size={12} color="#9ca3af" />
          <Text style={styles.infoText}>{proyecto.categoriasTaxonomicas[0] || 'Especie'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Users size={12} color="#15803d" />
          <Text style={[styles.infoText, styles.participantsText]}>
            {proyecto.cantidadParticipantes} participantes
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  participantsText: {
    color: '#15803d',
    fontWeight: '700',
  },
});
