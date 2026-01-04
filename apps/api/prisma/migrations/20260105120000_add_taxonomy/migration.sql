-- Add taxonomy tables for genres, groups, and categories.
BEGIN;

CREATE TABLE "CategoryGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER,

    CONSTRAINT "CategoryGroup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CategoryGroup_name_key" ON "CategoryGroup"("name");

ALTER TABLE "Category"
ADD COLUMN "groupId" TEXT;

CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

CREATE TABLE "StoryGenre" (
    "storyId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "StoryGenre_pkey" PRIMARY KEY ("storyId","genreId")
);

CREATE TABLE "StoryCategory" (
    "storyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "StoryCategory_pkey" PRIMARY KEY ("storyId","categoryId")
);

ALTER TABLE "Category"
ADD CONSTRAINT "Category_groupId_fkey"
FOREIGN KEY ("groupId") REFERENCES "CategoryGroup"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StoryGenre"
ADD CONSTRAINT "StoryGenre_storyId_fkey"
FOREIGN KEY ("storyId") REFERENCES "Story"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryGenre"
ADD CONSTRAINT "StoryGenre_genreId_fkey"
FOREIGN KEY ("genreId") REFERENCES "Genre"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryCategory"
ADD CONSTRAINT "StoryCategory_storyId_fkey"
FOREIGN KEY ("storyId") REFERENCES "Story"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryCategory"
ADD CONSTRAINT "StoryCategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "CategoryGroup" ("id", "name", "description", "order") VALUES
  ('group_criaturas', 'Criaturas', NULL, 1),
  ('group_personajes', 'Personajes', NULL, 2),
  ('group_lugares', 'Lugares', NULL, 3),
  ('group_objetos', 'Objetos', NULL, 4),
  ('group_fenomenos', 'Fenómenos', NULL, 5),
  ('group_rituales', 'Rituales', NULL, 6),
  ('group_psicologia', 'Psicología', NULL, 7),
  ('group_social', 'Social', NULL, 8),
  ('group_atmosferas', 'Atmósferas', NULL, 9),
  ('group_ambientacion', 'Ambientación', NULL, 10),
  ('group_formato', 'Formato', NULL, 11),
  ('group_advertencias', 'Advertencias', NULL, 12)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Genre" ("id", "name", "description") VALUES
  ('genre_sobrenatural', 'Sobrenatural', NULL),
  ('genre_psicologico', 'Psicológico', NULL),
  ('genre_slasher', 'Slasher', NULL),
  ('genre_gore', 'Gore', NULL),
  ('genre_paranormal', 'Paranormal', NULL),
  ('genre_gotico', 'Gótico', NULL),
  ('genre_lovecraftiano', 'Lovecraftiano', NULL),
  ('genre_apocaliptico', 'Apocalíptico', NULL),
  ('genre_distopico', 'Distópico', NULL),
  ('genre_cosmico', 'Cósmico', NULL),
  ('genre_demoniaco', 'Demoníaco', NULL),
  ('genre_oculto', 'Oculto', NULL),
  ('genre_ritualista', 'Ritualista', NULL),
  ('genre_folclorico', 'Folclórico', NULL),
  ('genre_maldito', 'Maldito', NULL),
  ('genre_macabro', 'Macabro', NULL),
  ('genre_siniestral', 'Siniestral', NULL),
  ('genre_grotesco', 'Grotesco', NULL),
  ('genre_tragico', 'Trágico', NULL),
  ('genre_fatalista', 'Fatalista', NULL),
  ('genre_nihilista', 'Nihilista', NULL),
  ('genre_enigmatico', 'Enigmático', NULL),
  ('genre_suspense', 'Suspense', NULL),
  ('genre_conspirativo', 'Conspirativo', NULL),
  ('genre_sectario', 'Sectario', NULL),
  ('genre_cientifico', 'Científico', NULL),
  ('genre_tecnologico', 'Tecnológico', NULL),
  ('genre_biologico', 'Biológico', NULL),
  ('genre_experimental', 'Experimental', NULL),
  ('genre_realista', 'Realista', NULL)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Category" ("id", "name", "description", "groupId") VALUES
  ('cat_banshee', 'Banshee', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_vampiros', 'Vampiros', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_licantropos', 'Licántropos', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_brujas', 'Brujas', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_demonios', 'Demonios', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_espectros', 'Espectros', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_zombis', 'Zombis', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_momias', 'Momias', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_esqueletos', 'Esqueletos', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_reptilianos', 'Reptilianos', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Criaturas')),
  ('cat_ninos_oscuros', 'Niños oscuros', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_anciano_maldito', 'Anciano maldito', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_mendigo_profeta', 'Mendigo profeta', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_investigador_obsesivo', 'Investigador obsesivo', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_sacerdote_caido', 'Sacerdote caído', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_medium', 'Médium', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_gemelo_perdido', 'Gemelo perdido', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_vecino_sospechoso', 'Vecino sospechoso', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_testigo_silencioso', 'Testigo silencioso', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_lider_de_culto', 'Líder de culto', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Personajes')),
  ('cat_casa_embrujada', 'Casa embrujada', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_mansion_maldita', 'Mansión maldita', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_hotel_maldito', 'Hotel maldito', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_hospital_abandonado', 'Hospital abandonado', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_escuela_abandonada', 'Escuela abandonada', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_metro_fantasma', 'Metro fantasma', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_pueblo_fantasma', 'Pueblo fantasma', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_cementerio', 'Cementerio', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_catacumbas', 'Catacumbas', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_bosque_oscuro', 'Bosque oscuro', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Lugares')),
  ('cat_anillo_maldito', 'Anillo maldito', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_reloj_parado', 'Reloj parado', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_vestido_novia', 'Vestido de novia', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_crucifijo_invertido', 'Crucifijo invertido', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_muneca_poseida', 'Muñeca poseída', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_libro_maldito', 'Libro maldito', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_retrato_maldito', 'Retrato maldito', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_llave_antigua', 'Llave antigua', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_caja_sellada', 'Caja sellada', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_mascara_ritual', 'Máscara ritual', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Objetos')),
  ('cat_posesion', 'Posesión', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_apariciones', 'Apariciones', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_poltergeist', 'Poltergeist', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_telequinesis', 'Telequinesis', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_levitacion', 'Levitación', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_materializacion', 'Materialización', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_paralisis_sueno', 'Parálisis del sueño', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_bucle_temporal', 'Bucle temporal', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_deja_vu', 'Deja vu', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_voz_en_pared', 'Voz en la pared', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Fenómenos')),
  ('cat_invocacion', 'Invocación', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_sacrificio', 'Sacrificio', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_exorcismo', 'Exorcismo', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_pacto_oscuro', 'Pacto oscuro', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_circulo_sal', 'Círculo de sal', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_ouija', 'Ouija', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_tarot', 'Tarot', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_grimorio', 'Grimorio', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_alquimia_oscura', 'Alquimia oscura', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_necromancia', 'Necromancia', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Rituales')),
  ('cat_delirio', 'Delirio', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_disociacion', 'Disociación', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_paranoia', 'Paranoia', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_amnesia', 'Amnesia', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_trauma', 'Trauma', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_culpa', 'Culpa', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_obsesion', 'Obsesión', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_alucinaciones', 'Alucinaciones', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_identidad_rota', 'Identidad rota', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_narrador_poco_fiable', 'Narrador poco fiable', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Psicología')),
  ('cat_manipulacion_psicologica', 'Manipulación psicológica', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_gaslighting', 'Gaslighting', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_lavado_cerebral', 'Lavado cerebral', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_vigilancia', 'Vigilancia', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_conspiracion', 'Conspiración', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_trafico_humano', 'Tráfico humano', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_secuestro', 'Secuestro', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_captividad', 'Captividad', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_acecho', 'Acecho', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_justicia_torcida', 'Justicia torcida', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Social')),
  ('cat_niebla_espesa', 'Niebla espesa', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_eclipse', 'Eclipse', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_luna_sangrienta', 'Luna sangrienta', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_solsticio', 'Solsticio', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_apagon', 'Apagón', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_lluvia_eterna', 'Lluvia eterna', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_silencio_total', 'Silencio total', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_estatica', 'Estática', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_interferencias', 'Interferencias', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_senal_perdida', 'Señal perdida', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Atmósferas')),
  ('cat_suburbio_olvidado', 'Suburbio olvidado', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_ciudad_ruinas', 'Ciudad en ruinas', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_carretera_nocturna', 'Carretera nocturna', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_cabana_aislada', 'Cabaña aislada', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_isla_maldita', 'Isla maldita', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_barco_fantasma', 'Barco fantasma', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_faro_solitario', 'Faro solitario', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_mina_abandonada', 'Mina abandonada', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_tuneles', 'Túneles', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_sotano', 'Sótano', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Ambientación')),
  ('cat_diario_primera_persona', 'Diario en primera persona', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_cartas', 'Cartas', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_expediente', 'Expediente', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_informe_forense', 'Informe forense', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_podcast', 'Podcast', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_transmision_en_vivo', 'Transmisión en vivo', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_chat_encontrado', 'Chat encontrado', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_grabacion_recuperada', 'Grabación recuperada', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_cinta_vhs', 'Cinta VHS', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_foto_maldita', 'Foto maldita', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Formato')),
  ('cat_contenido_sensible', 'Contenido sensible', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_violencia_explicita', 'Violencia explícita', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_sangre', 'Sangre', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_tortura', 'Tortura', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_mutilacion', 'Mutilación', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_canibalismo', 'Canibalismo', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_autolesion', 'Autolesión', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_suicidio', 'Suicidio', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_lenguaje_explicito', 'Lenguaje explícito', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias')),
  ('cat_contenido_sexual_18', 'Contenido sexual (+18)', NULL, (SELECT "id" FROM "CategoryGroup" WHERE "name" = 'Advertencias'))
ON CONFLICT ("name") DO NOTHING;

COMMIT;
