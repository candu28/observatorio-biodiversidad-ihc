import { database } from '../../../database';
import { IPerfilPort } from '../../../../application/ports/IPerfilPort';
import { IUsuario } from '../../../../../../contracts/types/IUsuario';
import { IAvistamiento } from '../../../../../../contracts/types/IAvistamiento';
import { IProyecto } from '../../../../../../contracts/types/IProyecto';
import Usuario from '../../../database/models/Usuario';
import Avistamiento from '../../../database/models/Avistamiento';
import Proyecto from '../../../database/models/Proyecto';
import { Q } from '@nozbe/watermelondb';

export class WatermelonPerfilRepository implements IPerfilPort {
  async getUsuarioActual(): Promise<IUsuario | null> {
    const usuarios = await database.get<Usuario>('usuarios').query().fetch();
    // En el futuro, retornar el que esté logueado con Supabase Auth.
    // Por ahora retornamos el primer usuario o null
    if (usuarios.length > 0) {
      return {
        id: usuarios[0].id,
        nombre: usuarios[0].nombre,
        ubicacion: usuarios[0].ubicacion,
        bio: usuarios[0].bio,
        fotoPerfilUrl: usuarios[0].fotoPerfilUrl,
        interes: usuarios[0].interes,
        totalAvistamientos: usuarios[0].totalAvistamientos,
        totalAciertosEspecies: usuarios[0].totalAciertosEspecies,
        createdAt: usuarios[0].createdAt
      };
    }
    return null;
  }

  async createUsuario(usuario: IUsuario): Promise<void> {
    await database.write(async () => {
      await database.get<Usuario>('usuarios').create((u: any) => {
        // En watermelon podemos proveer el ID para sincronización
        u._raw.id = usuario.id; 
        u.nombre = usuario.nombre;
        u.ubicacion = usuario.ubicacion;
        u.bio = usuario.bio;
        u.fotoPerfilUrl = usuario.fotoPerfilUrl;
        u.interes = usuario.interes || [];
        u.totalAvistamientos = usuario.totalAvistamientos || 0;
        u.totalAciertosEspecies = usuario.totalAciertosEspecies || 0;
        u.createdAt = usuario.createdAt || new Date().toISOString();
      });
    });
  }

  async updateUsuario(usuarioId: string, data: Partial<IUsuario>): Promise<void> {
    await database.write(async () => {
      const u = await database.get<Usuario>('usuarios').find(usuarioId);
      await u.update((record: any) => {
        if (data.nombre !== undefined) record.nombre = data.nombre;
        if (data.ubicacion !== undefined) record.ubicacion = data.ubicacion;
        if (data.bio !== undefined) record.bio = data.bio;
        if (data.fotoPerfilUrl !== undefined) record.fotoPerfilUrl = data.fotoPerfilUrl;
        if (data.interes !== undefined) record.interes = data.interes;
        if (data.totalAvistamientos !== undefined) record.totalAvistamientos = data.totalAvistamientos;
        if (data.totalAciertosEspecies !== undefined) record.totalAciertosEspecies = data.totalAciertosEspecies;
      });
    });
  }

  async getAvistamientosPorUsuario(usuarioId: string): Promise<IAvistamiento[]> {
    const avistamientos = await database.get<Avistamiento>('avistamientos')
      .query(Q.where('autor_id', usuarioId))
      .fetch();
      
    return avistamientos.map((a: any) => ({
      id: a.id,
      numeroPublicacion: a.numeroPublicacion,
      autorId: a.autorId,
      fotoUrl: a.fotoUrl,
      descripcionExperiencia: a.descripcionExperiencia,
      latitud: a.latitud,
      longitud: a.longitud,
      ubicacionTexto: a.ubicacionTexto,
      biomaId: a.biomaId,
      categoriaId: a.categoriaId,
      estado: a.estado as any,
      especieVerificadaId: a.especieVerificadaId,
      especieVerifNombre: a.especieVerifNombre,
      especieVerifNombreCientifico: a.especieVerifNombreCientifico,
      fechaCreacion: a.fechaCreacion,
    }));
  }

  async getProyectosPorUsuario(usuarioId: string): Promise<IProyecto[]> {
    const proyectos = await database.get<Proyecto>('proyectos')
      .query(Q.where('creador_id', usuarioId))
      .fetch();
      
    return proyectos.map((p: any) => ({
      id: p.id,
      creadorId: p.creadorId,
      titulo: p.titulo,
      descripcion: p.descripcion,
      bioma: p.bioma,
      categoriasTaxonomicas: p.categoriasTaxonomicas,
      ubicacionGeografica: p.ubicacionGeografica,
      fechaInicio: p.fechaInicio,
      cantidadParticipantes: p.cantidadParticipantes,
    }));
  }

  async registrarInteres(usuarioId: string, avistamientoId: string): Promise<void> {
    await database.write(async () => {
      const u = await database.get<Usuario>('usuarios').find(usuarioId);
      const interesesActuales = u.interes || [];
      if (!interesesActuales.includes(avistamientoId)) {
        await u.update((record: any) => {
          record.interes = [...interesesActuales, avistamientoId];
        });
      } else {
        // Toggle: si ya le dio like, se lo quitamos
        await u.update((record: any) => {
          record.interes = interesesActuales.filter((id: any) => id !== avistamientoId);
        });
      }
    });
  }

  async actualizarPuntos(usuarioId: string, puntos: number): Promise<void> {
    await database.write(async () => {
      const u = await database.get<Usuario>('usuarios').find(usuarioId);
      await u.update((record: any) => {
        // En una bd real podría ser un campo de puntos separados. Aquí uso totalAciertosEspecies para puntos como mock
        record.totalAciertosEspecies = (record.totalAciertosEspecies || 0) + puntos;
      });
    });
  }
}
