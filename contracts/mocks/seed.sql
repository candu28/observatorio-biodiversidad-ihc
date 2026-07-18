-- ==========================================
-- SCRIPT DE POBLADO DE DATOS (SEED)
-- Basado en dbMockData.json
-- ==========================================

-- 1. USUARIOS
INSERT INTO public.usuarios (id, nombre, ubicacion, bio, foto_perfil_url, interes, total_avistamientos, total_aciertos_especies, created_at, updated_at) VALUES
('e44d32cb-5e60-496f-a89c-9db8a72ec222', 'Ana García', 'Caracas, Venezuela', 'Amante de las orquídeas y la fotografía.', 'https://i.pravatar.cc/150?u=ana', ARRAY['Botánica', 'Fotografía'], 15, 5, '2026-01-10 10:00:00', '2026-01-10 10:00:00'),
('d0d62590-7dfd-453b-8ea9-7de4772ab16d', 'Luis Silva', 'Puerto Ordaz, Venezuela', 'Investigador aficionado de ranas.', 'https://i.pravatar.cc/150?u=luis', ARRAY['Herpetología'], 42, 12, '2026-02-15 10:00:00', '2026-02-15 10:00:00'),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'María Antonieta', 'Mérida, Venezuela', 'Observadora de aves andinas.', 'https://i.pravatar.cc/150?u=maria', ARRAY['Ornitología'], 8, 2, '2026-03-20 10:00:00', '2026-03-20 10:00:00');

-- 2. BIOMAS
INSERT INTO public.biomas (id, nombre, descripcion, created_at, updated_at) VALUES
('2e6b0a8f-2877-4b77-a8bf-1234567890ab', 'Selva Tropical', 'Bosque denso, húmedo y con alta biodiversidad.', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('c1f8a846-fc3e-43b6-9bb2-402a5cf38b1f', 'Sabana', 'Llanuras abiertas con vegetación herbácea.', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('99999999-9999-9999-9999-999999999999', 'Páramo', 'Ecosistema de alta montaña, frío y húmedo.', '2026-01-01 10:00:00', '2026-01-01 10:00:00');

-- 3. CATEGORIAS TAXONOMICAS
INSERT INTO public.categorias_taxonomicas (id, nombre, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Anfibios', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('22222222-2222-2222-2222-222222222222', 'Plantas', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('33333333-3333-3333-3333-333333333333', 'Aves', '2026-01-01 10:00:00', '2026-01-01 10:00:00');

-- 4. ESPECIES
INSERT INTO public.especies (id, nombre_comun, nombre_cientifico, categoria_id, bioma_id, total_observaciones, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sapo Minero', 'Dendrobates leucomelas', '11111111-1111-1111-1111-111111111111', '2e6b0a8f-2877-4b77-a8bf-1234567890ab', 12, '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Orquídea Nacional', 'Cattleya mossiae', '22222222-2222-2222-2222-222222222222', '2e6b0a8f-2877-4b77-a8bf-1234567890ab', 5, '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Turpial', 'Icterus icterus', '33333333-3333-3333-3333-333333333333', 'c1f8a846-fc3e-43b6-9bb2-402a5cf38b1f', 30, '2026-01-01 10:00:00', '2026-01-01 10:00:00');

-- 5. AVISTAMIENTOS
INSERT INTO public.avistamientos (id, numero_publicacion, autor_id, foto_url, descripcion_experiencia, latitud, longitud, ubicacion_texto, bioma_id, categoria_id, estado, especie_verificada_id, especie_verif_nombre, especie_verif_nombre_cientifico, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333333', 1, 'd0d62590-7dfd-453b-8ea9-7de4772ab16d', 'https://i.pravatar.cc/300?img=sapo', 'Encontrado cerca de una piedra húmeda.', 8.3, -62.6, 'Parque Cachamay', '2e6b0a8f-2877-4b77-a8bf-1234567890ab', '11111111-1111-1111-1111-111111111111', 'Verificado', NULL, 'Sapo Minero', 'Dendrobates leucomelas', '2026-05-10 10:00:00', '2026-05-10 10:00:00'),
('44444444-3333-3333-3333-333333333333', 2, 'e44d32cb-5e60-496f-a89c-9db8a72ec222', 'https://i.pravatar.cc/300?img=orquidea', 'Orquídea floreciendo en un árbol alto.', 10.5, -66.9, 'Cerro El Ávila', '2e6b0a8f-2877-4b77-a8bf-1234567890ab', '22222222-2222-2222-2222-222222222222', 'Pendiente', NULL, NULL, NULL, '2026-06-15 10:00:00', '2026-06-15 10:00:00'),
('55555555-3333-3333-3333-333333333333', 3, 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'https://i.pravatar.cc/300?img=turpial', 'Pájaro amarillo cantando por la mañana.', 8.6, -70.2, 'Llanos de Barinas', 'c1f8a846-fc3e-43b6-9bb2-402a5cf38b1f', '33333333-3333-3333-3333-333333333333', 'Verificado', NULL, 'Turpial', 'Icterus icterus', '2026-07-01 08:00:00', '2026-07-01 08:00:00');

-- 6. MULTIMEDIA AVISTAMIENTOS
INSERT INTO public.multimedia_avistamiento (id, avistamiento_id, archivo_url, tipo_multimedia) VALUES
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'https://i.pravatar.cc/300?img=sapo2', 'Foto'),
('55555555-4444-4444-4444-444444444444', '44444444-3333-3333-3333-333333333333', 'https://i.pravatar.cc/300?img=orquidea2', 'Foto'),
('66666666-4444-4444-4444-444444444444', '55555555-3333-3333-3333-333333333333', 'https://i.pravatar.cc/300?img=turpial2', 'Video');

-- 7. COMENTARIOS
INSERT INTO public.comentarios_avistamiento (comentario_id, avistamiento_id, autor_id, contenido, created_at, updated_at) VALUES
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'e44d32cb-5e60-496f-a89c-9db8a72ec222', '¡Excelente hallazgo!', '2026-05-11 10:00:00', '2026-05-11 10:00:00'),
('66666666-5555-5555-5555-555555555555', '44444444-3333-3333-3333-333333333333', 'd0d62590-7dfd-453b-8ea9-7de4772ab16d', 'Qué colores tan vivos.', '2026-06-16 10:00:00', '2026-06-16 10:00:00'),
('77777777-5555-5555-5555-555555555555', '55555555-3333-3333-3333-333333333333', 'e44d32cb-5e60-496f-a89c-9db8a72ec222', 'Me encanta el canto del turpial.', '2026-07-02 10:00:00', '2026-07-02 10:00:00');

-- 8. SUGERENCIAS ESPECIE
INSERT INTO public.sugerencias_especie (avistamiento_id, usuario_id, nombre_propuesto, votos_a_favor, votos_en_contra, usuarios_interaccion_ids, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333333', 'd0d62590-7dfd-453b-8ea9-7de4772ab16d', 'Sapo Minero', 2, 0, '{}', '2026-05-10 10:00:00', '2026-05-10 10:00:00'),
('44444444-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Orquídea Nacional', 1, 0, '{}', '2026-06-15 12:00:00', '2026-06-15 12:00:00');

-- Nota: Actualizamos el FK especie_verificada_id en avistamientos ahora que la sugerencia existe
UPDATE public.avistamientos SET especie_verificada_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE public.avistamientos SET especie_verificada_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' WHERE id = '55555555-3333-3333-3333-333333333333';

-- 9. PROYECTOS
INSERT INTO public.proyectos (id, creador_id, titulo, descripcion, bioma_id, ubicacion_geografica, cantidad_participantes, created_at, updated_at) VALUES
('66666666-6666-6666-6666-666666666666', 'e44d32cb-5e60-496f-a89c-9db8a72ec222', 'Rescate de Orquídeas', 'Proyecto comunitario para identificar orquídeas raras.', '2e6b0a8f-2877-4b77-a8bf-1234567890ab', 'Guayana', 2, '2026-06-01 10:00:00', '2026-06-01 10:00:00'),
('77777777-6666-6666-6666-666666666666', 'd0d62590-7dfd-453b-8ea9-7de4772ab16d', 'Censo de Aves Llaneras', 'Registro de todas las aves en la región de Barinas.', 'c1f8a846-fc3e-43b6-9bb2-402a5cf38b1f', 'Los Llanos', 3, '2026-07-01 10:00:00', '2026-07-01 10:00:00');

-- 10. TAREAS PROYECTO
INSERT INTO public.tareas_proyecto (proyecto_id, tarea_id, titulo_tarea, descripcion_instrucciones, created_at, updated_at) VALUES
('66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', 'Mapear zona norte', 'Tomar fotos de toda flor en la zona norte del parque.', '2026-06-02 10:00:00', '2026-06-02 10:00:00'),
('77777777-6666-6666-6666-666666666666', '88888888-7777-7777-7777-777777777777', 'Buscar nidos', 'Fotografiar nidos de aves sin perturbarlos.', '2026-07-02 10:00:00', '2026-07-02 10:00:00');

-- 11. APORTES TAREA
INSERT INTO public.aportes_tarea (proyecto_id, tarea_id, aporte_id, usuario_id, tipo_multimedia, archivo_url, comentario_descriptivo, created_at, updated_at) VALUES
('66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', 'd0d62590-7dfd-453b-8ea9-7de4772ab16d', 'Foto', 'https://i.pravatar.cc/300?img=flor', 'Aquí hay una Cattleya', '2026-06-03 10:00:00', '2026-06-03 10:00:00'),
('77777777-6666-6666-6666-666666666666', '88888888-7777-7777-7777-777777777777', '99999999-8888-8888-8888-888888888888', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Foto', 'https://i.pravatar.cc/300?img=nido', 'Encontré un nido de Turpial', '2026-07-03 10:00:00', '2026-07-03 10:00:00');

-- 12. PROYECTOS AVISTAMIENTOS
INSERT INTO public.proyectos_avistamientos (proyecto_id, avistamiento_id, created_at, updated_at) VALUES
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', '2026-06-03 10:00:00', '2026-06-03 10:00:00'),
('77777777-6666-6666-6666-666666666666', '55555555-3333-3333-3333-333333333333', '2026-07-03 10:00:00', '2026-07-03 10:00:00');

-- 13. PARTICIPANTES PROYECTO
INSERT INTO public.participantes_proyecto (proyecto_id, usuario_id, created_at, updated_at) VALUES
('66666666-6666-6666-6666-666666666666', 'd0d62590-7dfd-453b-8ea9-7de4772ab16d', '2026-06-02 10:00:00', '2026-06-02 10:00:00'),
('77777777-6666-6666-6666-666666666666', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', '2026-07-02 10:00:00', '2026-07-02 10:00:00');
