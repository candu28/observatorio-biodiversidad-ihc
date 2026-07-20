import { IAporteTarea } from '../../../../contracts/types/IAporteTarea';
import { ILocalProyectoRepository } from '../ports/ILocalProyectoRepository';

export interface AgregarAporteTareaInput {
  proyectoId: string;
  tareaId: string;
  usuarioId: string;
  archivoUrl: string;
  comentarioDescriptivo: string;
  tipoMultimedia: 'imagen' | 'video';
}

export class AgregarAporteTareaUseCase {
  constructor(private readonly proyectoRepository: ILocalProyectoRepository) {}

  /**
   * Ejecuta el caso de uso para agregar un aporte a una tarea.
   * Aplica reglas de negocio: validación de campos obligatorios y longitud mínima de comentario.
   */
  async execute(input: AgregarAporteTareaInput): Promise<void> {
    // Regla de negocio: La foto (archivoUrl) es obligatoria
    if (!input.archivoUrl || input.archivoUrl.trim() === '') {
      throw new Error('Debe proporcionar una imagen para el aporte.');
    }

    // Regla de negocio: El comentario descriptivo es obligatorio y debe tener al menos 5 caracteres
    if (!input.comentarioDescriptivo || input.comentarioDescriptivo.trim().length < 5) {
      throw new Error('El comentario debe ser descriptivo (al menos 5 caracteres).');
    }

    // Regla de negocio: Validar presencia de IDs fundamentales
    if (!input.proyectoId || !input.tareaId || !input.usuarioId) {
      throw new Error('Información de identificación incompleta para el aporte.');
    }

    // Mapeo a la entidad IAporteTarea, generando datos de infraestructura (ID y fecha) en esta capa
    const aporte: IAporteTarea = {
      ...input,
      aporteId: Math.random().toString(36).substring(7),
      fechaAporte: new Date().toISOString(),
    };

    await this.proyectoRepository.addAporte(aporte);
  }
}
