/**
 * Bilingual feast-day directory used by SaintOfTheDay.jsx.
 *
 * FEAST_DAYS: keyed by "M/D" (month/day, no leading zeros). Each entry has
 *   bilingual fields {name, feast, desc}, each an object {en, es}.
 *
 * DOMINICAN_SAINTS: fallback rotation for any calendar day without a named
 *   feast. Same bilingual shape; every entry carries an explicit feast field.
 *
 * Translation tone: traditional Catholic Spanish hagiography — natural,
 * reverent. Spanish quotations are given in the saint's original Spanish
 * where applicable.
 */

export const FEAST_DAYS = {
  "1/1": {
    name: { en: "Mary, Mother of God", es: "Santa María, Madre de Dios" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "The Octave of Christmas honors the Theotokos — God-bearer — whose 'yes' opened the door of salvation for all humanity.",
      es: "La Octava de Navidad honra a la Theotokos — Madre de Dios — cuyo 'sí' abrió la puerta de la salvación para toda la humanidad.",
    },
  },
  "1/3": {
    name: { en: "Most Holy Name of Jesus", es: "Santísimo Nombre de Jesús" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "The Church venerates the Name given by the angel — the only name under heaven by which we are saved (Acts 4:12).",
      es: "La Iglesia venera el Nombre dado por el ángel — el único nombre bajo el cielo por el que somos salvados (Hch 4,12).",
    },
  },
  "1/4": {
    name: { en: "St. Elizabeth Ann Seton", es: "Santa Isabel Ana Seton" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "First native-born American saint, widow and mother who founded the Sisters of Charity and pioneered Catholic education in the United States.",
      es: "Primera santa nacida en Estados Unidos, viuda y madre que fundó las Hermanas de la Caridad y fue pionera de la educación católica en su país.",
    },
  },
  "1/5": {
    name: { en: "St. John Neumann", es: "San Juan Neumann" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Bohemian-born Redemptorist and Bishop of Philadelphia, who organized the first diocesan parochial school system in the United States.",
      es: "Redentorista de origen bohemio y obispo de Filadelfia, organizador del primer sistema diocesano de escuelas parroquiales en Estados Unidos.",
    },
  },
  "1/17": {
    name: { en: "St. Anthony the Abbot", es: "San Antonio Abad" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Father of monasticism who fled to the Egyptian desert, spending decades in prayer and spiritual combat to draw closer to God.",
      es: "Padre del monacato que se retiró al desierto egipcio, pasando décadas en oración y combate espiritual para acercarse más a Dios.",
    },
  },
  "1/21": {
    name: { en: "St. Agnes", es: "Santa Inés" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "A young Roman martyr who chose death over renouncing her faith, one of the most beloved virgin martyrs of the Church.",
      es: "Joven mártir romana que prefirió la muerte antes que renunciar a su fe; una de las vírgenes mártires más queridas de la Iglesia.",
    },
  },
  "1/24": {
    name: { en: "St. Francis de Sales", es: "San Francisco de Sales" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Bishop and Doctor of the Church, patron of writers, who taught that holiness is possible in every state of life through gentle love.",
      es: "Obispo y Doctor de la Iglesia, patrono de los escritores, que enseñó que la santidad es posible en todo estado de vida mediante un amor manso.",
    },
  },
  "1/25": {
    name: { en: "Conversion of St. Paul", es: "Conversión de San Pablo" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "The road to Damascus moment when Saul of Tarsus met the risen Christ and became the greatest apostle to the Gentiles.",
      es: "El encuentro en el camino de Damasco, cuando Saulo de Tarso vio al Cristo resucitado y se convirtió en el más grande apóstol de los gentiles.",
    },
  },
  "1/28": {
    name: { en: "St. Thomas Aquinas", es: "Santo Tomás de Aquino" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Dominican friar and Doctor of the Church. His Summa Theologiae united faith and reason with unparalleled brilliance. Patron of students and universities.",
      es: "Fraile dominico y Doctor de la Iglesia. Su Suma Teológica unió fe y razón con brillantez sin par. Patrono de los estudiantes y las universidades.",
    },
  },
  "1/31": {
    name: { en: "St. John Bosco", es: "San Juan Bosco" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Founder of the Salesians and patron of youth, who devoted his life to educating poor young people through kindness and patience.",
      es: "Fundador de los Salesianos y patrono de la juventud, dedicó su vida a la educación de los jóvenes pobres con bondad y paciencia.",
    },
  },
  "2/2": {
    name: { en: "Presentation of the Lord", es: "Presentación del Señor" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Forty days after Christmas, Mary and Joseph presented Jesus in the Temple, where Simeon proclaimed him 'a light for the nations.'",
      es: "Cuarenta días después de Navidad, María y José presentaron a Jesús en el Templo, donde Simeón lo proclamó 'luz para las naciones'.",
    },
  },
  "2/3": {
    name: { en: "St. Blaise", es: "San Blas" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Armenian bishop and martyr remembered for healing a boy choking on a fishbone. The Church blesses throats in his name each year.",
      es: "Obispo y mártir armenio recordado por curar a un niño con un hueso atravesado en la garganta. Cada año la Iglesia bendice las gargantas en su nombre.",
    },
  },
  "2/5": {
    name: { en: "St. Agatha", es: "Santa Águeda" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Sicilian virgin and martyr of the third century who endured terrible tortures rather than betray Christ. Patron of breast-cancer patients.",
      es: "Virgen y mártir siciliana del siglo III que soportó terribles tormentos antes que traicionar a Cristo. Patrona de las enfermas de cáncer de mama.",
    },
  },
  "2/8": {
    name: { en: "St. Josephine Bakhita", es: "Santa Josefina Bakhita" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Sudanese former slave who became a Canossian sister in Italy. Patron of survivors of human trafficking and a witness to the freedom of grace.",
      es: "Antigua esclava sudanesa que se hizo religiosa canosiana en Italia. Patrona de las víctimas de la trata de personas y testigo de la libertad de la gracia.",
    },
  },
  "2/11": {
    name: { en: "Our Lady of Lourdes", es: "Nuestra Señora de Lourdes" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "In 1858, Mary appeared to Bernadette Soubirous in Lourdes, France, saying 'I am the Immaculate Conception.' The shrine draws millions each year.",
      es: "En 1858, la Virgen se apareció a Bernardita Soubirous en Lourdes, diciendo 'Yo soy la Inmaculada Concepción'. El santuario atrae cada año a millones de peregrinos.",
    },
  },
  "2/12": {
    name: { en: "Bl. Reginald of Orléans", es: "Beato Reginaldo de Orleans" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Distinguished canonist of Paris who received the Dominican habit from the Blessed Virgin and became one of St. Dominic's first companions.",
      es: "Insigne canonista de París que recibió el hábito dominico de manos de la Santísima Virgen y se convirtió en uno de los primeros compañeros de Santo Domingo.",
    },
  },
  "2/13": {
    name: { en: "Bl. Jordan of Saxony", es: "Beato Jordán de Sajonia" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Second Master of the Order of Preachers and successor of St. Dominic, who clothed nearly a thousand friars and wrote with luminous tenderness to Bl. Diana d'Andalo.",
      es: "Segundo Maestro de la Orden de Predicadores y sucesor de Santo Domingo. Vistió con el hábito a cerca de mil frailes y escribió con luminosa ternura a la Beata Diana d'Andalo.",
    },
  },
  "2/14": {
    name: { en: "Sts. Cyril and Methodius", es: "Santos Cirilo y Metodio" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Missionary brothers who brought the Gospel to the Slavic peoples and created an alphabet to translate Scripture into their language.",
      es: "Hermanos misioneros que llevaron el Evangelio a los pueblos eslavos y crearon un alfabeto para traducir la Escritura a su lengua.",
    },
  },
  "2/22": {
    name: { en: "Chair of St. Peter", es: "Cátedra de San Pedro" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "A feast celebrating the authority Christ gave to Peter — and his successors — to shepherd and teach the universal Church.",
      es: "Fiesta que celebra la autoridad que Cristo confió a Pedro — y a sus sucesores — para apacentar y enseñar a la Iglesia universal.",
    },
  },
  "3/7": {
    name: { en: "Sts. Perpetua and Felicity", es: "Santas Perpetua y Felicidad" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "A noblewoman and her slave, both martyred in Carthage in 203 AD. Perpetua's prison diary is among the earliest Christian writings.",
      es: "Una noble y su esclava, mártires en Cartago en el año 203. El diario de prisión de Perpetua es uno de los primeros escritos cristianos.",
    },
  },
  "3/17": {
    name: { en: "St. Patrick", es: "San Patricio" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "The Apostle of Ireland, who was taken captive as a young man and later returned to evangelize the Irish people with extraordinary zeal.",
      es: "El Apóstol de Irlanda, llevado cautivo de joven, regresó después para evangelizar al pueblo irlandés con extraordinario celo.",
    },
  },
  "3/19": {
    name: { en: "St. Joseph", es: "San José" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "Husband of Mary, foster father of Jesus, patron of the universal Church, workers, and a happy death. 'He who found Jesus has found all treasure.'",
      es: "Esposo de María, padre putativo de Jesús, patrono de la Iglesia universal, de los trabajadores y de la buena muerte. 'Quien encontró a Jesús ha encontrado todo tesoro.'",
    },
  },
  "3/24": {
    name: { en: "St. Óscar Romero", es: "San Óscar Romero" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Archbishop of San Salvador, martyred at the altar in 1980 for defending the poor and denouncing injustice in El Salvador.",
      es: "Arzobispo de San Salvador, martirizado en el altar en 1980 por defender a los pobres y denunciar la injusticia en El Salvador.",
    },
  },
  "3/25": {
    name: { en: "Annunciation of the Lord", es: "Anunciación del Señor" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "The angel Gabriel appeared to Mary, announcing she would bear the Son of God. Her 'Let it be done' changed the course of history.",
      es: "El ángel Gabriel se apareció a María anunciándole que sería Madre del Hijo de Dios. Su 'Hágase' cambió el curso de la historia.",
    },
  },
  "4/25": {
    name: { en: "St. Mark", es: "San Marcos" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Evangelist and companion of Peter, whose Gospel — the earliest written — captures Jesus' ministry with vivid urgency and power.",
      es: "Evangelista y compañero de Pedro. Su Evangelio — el primero escrito — recoge el ministerio de Jesús con viva urgencia y fuerza.",
    },
  },
  "4/28": {
    name: { en: "St. Louis de Montfort", es: "San Luis María Grignion de Montfort" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "French missionary and Marian apostle whose 'True Devotion to Mary' shaped centuries of consecration to Jesus through her Immaculate Heart.",
      es: "Misionero francés y apóstol mariano. Su 'Verdadera Devoción a María' formó siglos de consagración a Jesús por el Corazón Inmaculado de su Madre.",
    },
  },
  "4/29": {
    name: { en: "St. Catherine of Siena", es: "Santa Catalina de Siena" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Dominican tertiary and Doctor of the Church, patron of Italy and Europe. She confronted popes, cared for the sick, and wrote, 'Be who God meant you to be and you will set the world on fire.'",
      es: "Terciaria dominica y Doctora de la Iglesia, patrona de Italia y de Europa. Reprendió a los papas, cuidó a los enfermos y escribió: 'Sé quien Dios quiere que seas y prenderás fuego al mundo.'",
    },
  },
  "5/1": {
    name: { en: "St. Joseph the Worker", es: "San José Obrero" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "A feast honoring Joseph as patron of all who labor, reminding us that daily work done with love participates in God's ongoing creation.",
      es: "Memoria que honra a José como patrono de cuantos trabajan, recordándonos que la labor diaria hecha con amor participa de la obra creadora de Dios.",
    },
  },
  "5/12": {
    name: { en: "Bl. Imelda Lambertini", es: "Beata Imelda Lambertini" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Dominican child mystic of the Eucharist who, longing for her First Communion, was granted the Host miraculously by an angel and died in ecstasy at age eleven.",
      es: "Niña mística dominica de la Eucaristía. Anhelando su primera comunión, recibió milagrosamente la Hostia de manos de un ángel y murió en éxtasis a los once años.",
    },
  },
  "5/13": {
    name: { en: "Our Lady of Fatima", es: "Nuestra Señora de Fátima" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "In 1917, the Mother of God appeared to three shepherd children in Portugal, calling the world to prayer, penance, and the rosary.",
      es: "En 1917, la Madre de Dios se apareció a tres pastorcitos en Portugal, llamando al mundo a la oración, la penitencia y el rezo del Rosario.",
    },
  },
  "5/22": {
    name: { en: "St. Rita of Cascia", es: "Santa Rita de Casia" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Italian widow and Augustinian nun, patron of impossible causes, who bore a wound from the crown of thorns the last fifteen years of her life.",
      es: "Viuda italiana y religiosa agustina, patrona de los imposibles, que llevó en la frente una herida de la corona de espinas los últimos quince años de su vida.",
    },
  },
  "5/26": {
    name: { en: "St. Philip Neri", es: "San Felipe Neri" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "The 'Apostle of Rome,' known for his joyful spirit, humor, and love for souls. He founded the Oratory and transformed Rome through joy.",
      es: "El 'Apóstol de Roma', célebre por su espíritu alegre, su humor y su amor a las almas. Fundó el Oratorio y transformó Roma con la alegría.",
    },
  },
  "5/31": {
    name: { en: "Visitation of the Virgin Mary", es: "Visitación de la Virgen María" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Mary visited her cousin Elizabeth carrying the unborn Christ, and at her greeting, John the Baptist leapt for joy in the womb.",
      es: "María visitó a su prima Isabel llevando consigo al Cristo aún no nacido, y al oír su saludo, Juan el Bautista saltó de gozo en el seno materno.",
    },
  },
  "6/3": {
    name: { en: "St. Charles Lwanga & Companions", es: "Santos Carlos Lwanga y Compañeros" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Ugandan martyrs, young Christians of the royal court burned alive in 1886 for refusing to betray their baptismal faith.",
      es: "Mártires de Uganda, jóvenes cristianos de la corte real quemados vivos en 1886 por negarse a traicionar la fe bautismal.",
    },
  },
  "6/11": {
    name: { en: "St. Barnabas", es: "San Bernabé" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Companion of Paul and called an apostle in Acts, Barnabas — 'son of encouragement' — opened Antioch and the Gentile mission to the Church.",
      es: "Compañero de Pablo y llamado apóstol en los Hechos, Bernabé — 'hijo de la consolación' — abrió Antioquía y la misión a los gentiles para la Iglesia.",
    },
  },
  "6/13": {
    name: { en: "St. Anthony of Padua", es: "San Antonio de Padua" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Franciscan friar and Doctor of the Church, whose preaching moved thousands. Patron of lost things and the poor.",
      es: "Fraile franciscano y Doctor de la Iglesia, cuya predicación conmovió a multitudes. Patrono de los objetos perdidos y de los pobres.",
    },
  },
  "6/22": {
    name: { en: "Sts. Thomas More & John Fisher", es: "Santos Tomás Moro y Juan Fisher" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "English martyrs under Henry VIII — a lord chancellor and a bishop — who died rather than deny the unity of the Church and the supremacy of Peter.",
      es: "Mártires ingleses bajo Enrique VIII — un canciller y un obispo — que prefirieron la muerte antes que negar la unidad de la Iglesia y el primado de Pedro.",
    },
  },
  "6/24": {
    name: { en: "Birth of John the Baptist", es: "Natividad de San Juan Bautista" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "The only saint besides Mary whose birth — not death — is celebrated. John came as voice crying in the wilderness, preparing the way for the Lord.",
      es: "El único santo, además de María, cuyo nacimiento se celebra. Juan vino como voz que clama en el desierto, preparando el camino del Señor.",
    },
  },
  "6/29": {
    name: { en: "Sts. Peter and Paul", es: "Santos Pedro y Pablo" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "The two great pillars of the Church — Peter the Rock and Paul the Apostle to the Nations — both martyred in Rome for the faith.",
      es: "Los dos grandes pilares de la Iglesia — Pedro la Roca y Pablo el Apóstol de los gentiles — ambos martirizados en Roma por la fe.",
    },
  },
  "7/3": {
    name: { en: "St. Thomas the Apostle", es: "Santo Tomás Apóstol" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "The 'doubting' apostle whose encounter with the risen Christ produced the greatest act of faith in the Gospels: 'My Lord and my God!'",
      es: "El apóstol 'incrédulo' cuyo encuentro con el Cristo resucitado dio el más grande acto de fe de los Evangelios: '¡Señor mío y Dios mío!'",
    },
  },
  "7/4": {
    name: { en: "Bl. Pier Giorgio Frassati", es: "Beato Pier Giorgio Frassati" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Dominican tertiary and 'man of the Beatitudes,' a young Italian mountaineer who served the poor of Turin in secret and died at twenty-four.",
      es: "Terciario dominico y 'hombre de las Bienaventuranzas', joven montañero italiano que servía en secreto a los pobres de Turín y murió a los veinticuatro años.",
    },
  },
  "7/6": {
    name: { en: "St. Maria Goretti", es: "Santa María Goretti" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Italian peasant girl, martyred at eleven defending her purity, who forgave her attacker from her deathbed and prayed for his conversion.",
      es: "Joven campesina italiana, mártir a los once años en defensa de su pureza, que perdonó desde su lecho de muerte a su agresor y rogó por su conversión.",
    },
  },
  "7/11": {
    name: { en: "St. Benedict", es: "San Benito" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Father of Western monasticism and patron of Europe, whose Rule has shaped monastic life — and Western civilization — for fifteen centuries.",
      es: "Padre del monacato occidental y patrono de Europa. Su Regla ha modelado la vida monástica — y la civilización de Occidente — durante quince siglos.",
    },
  },
  "7/14": {
    name: { en: "St. Kateri Tekakwitha", es: "Santa Kateri Tekakwitha" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "The 'Lily of the Mohawks,' first Native American canonized saint. Despite illness and rejection, she chose Christ and lived a life of fervent prayer.",
      es: "La 'Azucena de los Mohawk', primera nativa norteamericana canonizada. A pesar de la enfermedad y el rechazo, eligió a Cristo y vivió una vida de oración ferviente.",
    },
  },
  "7/16": {
    name: { en: "Our Lady of Mt. Carmel", es: "Nuestra Señora del Carmen" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Patroness of the Carmelite Order, whose scapular is a sign of consecration to Mary and confidence in her motherly protection.",
      es: "Patrona de la Orden del Carmen, cuyo escapulario es signo de consagración a María y de confianza en su protección maternal.",
    },
  },
  "7/22": {
    name: { en: "St. Mary Magdalene", es: "Santa María Magdalena" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "First witness of the Resurrection, 'Apostle to the Apostles.' She stood at the cross, sat at Jesus' feet, and was first to proclaim 'He is risen!'",
      es: "Primer testigo de la Resurrección, 'Apóstol de los apóstoles'. Estuvo junto a la cruz, se sentó a los pies de Jesús y fue la primera en anunciar: '¡Ha resucitado!'",
    },
  },
  "7/25": {
    name: { en: "St. James", es: "Santiago Apóstol" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Son of Zebedee and brother of John, the first apostle to be martyred for the faith and patron of pilgrims who journey to Santiago de Compostela.",
      es: "Hijo del Zebedeo y hermano de Juan, primer apóstol mártir por la fe y patrono de los peregrinos que caminan a Santiago de Compostela.",
    },
  },
  "7/26": {
    name: { en: "Sts. Joachim and Anne", es: "Santos Joaquín y Ana" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "The parents of the Virgin Mary, honored for the faithful home in which they raised the woman who would become the Mother of God.",
      es: "Padres de la Virgen María, honrados por el hogar fiel en el que criaron a la mujer que sería Madre de Dios.",
    },
  },
  "7/29": {
    name: { en: "Sts. Martha, Mary, and Lazarus", es: "Santos Marta, María y Lázaro" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "The household of Bethany who welcomed Jesus as friend. Martha served, Mary listened, and Lazarus was raised from the dead.",
      es: "La familia de Betania que acogió a Jesús como amigo. Marta servía, María escuchaba y Lázaro fue resucitado de entre los muertos.",
    },
  },
  "7/31": {
    name: { en: "St. Ignatius of Loyola", es: "San Ignacio de Loyola" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Founder of the Society of Jesus and author of the Spiritual Exercises, Ignatius sought to 'find God in all things' — and did.",
      es: "Fundador de la Compañía de Jesús y autor de los Ejercicios Espirituales. Buscó 'hallar a Dios en todas las cosas' — y lo halló.",
    },
  },
  "8/4": {
    name: { en: "St. John Vianney", es: "San Juan María Vianney" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "The Curé of Ars, patron of parish priests, who spent up to 16 hours daily in the confessional and drew pilgrims from across Europe.",
      es: "El Cura de Ars, patrono de los párrocos, que pasaba hasta dieciséis horas diarias en el confesonario y atraía peregrinos de toda Europa.",
    },
  },
  "8/6": {
    name: { en: "Transfiguration of the Lord", es: "Transfiguración del Señor" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "On Mount Tabor, Jesus revealed his divine glory before Peter, James, and John — a foretaste of the Resurrection and the destiny of every Christian.",
      es: "En el Tabor, Jesús reveló su gloria divina ante Pedro, Santiago y Juan — anticipo de la Resurrección y del destino de todo cristiano.",
    },
  },
  "8/8": {
    name: { en: "St. Dominic", es: "Santo Domingo de Guzmán" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Founder of the Order of Preachers. Dominic united contemplation and action, prayer and study, in a life devoted entirely to preaching truth and saving souls. Our patron.",
      es: "Fundador de la Orden de Predicadores. Domingo unió contemplación y acción, oración y estudio, en una vida enteramente entregada a la predicación de la verdad y la salvación de las almas. Nuestro patrono.",
    },
  },
  "8/9": {
    name: { en: "St. Teresa Benedicta of the Cross", es: "Santa Teresa Benedicta de la Cruz" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Edith Stein — Jewish philosopher, Carmelite nun, and martyr of Auschwitz — co-patroness of Europe and witness to truth at the price of blood.",
      es: "Edith Stein — filósofa judía, carmelita y mártir de Auschwitz — copatrona de Europa y testigo de la verdad hasta el derramamiento de sangre.",
    },
  },
  "8/10": {
    name: { en: "St. Lawrence", es: "San Lorenzo" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "A deacon of Rome martyred in 258 AD, who told his torturers to turn him over as he was done on one side. His charity to the poor is a model for all.",
      es: "Diácono de Roma, mártir en el año 258, que pidió a sus verdugos que lo voltearan, pues ya estaba asado de un lado. Su caridad con los pobres es modelo para todos.",
    },
  },
  "8/11": {
    name: { en: "St. Clare", es: "Santa Clara de Asís" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Friend of St. Francis and founder of the Poor Clares, Clare embraced radical poverty as her path to God, becoming a mirror of the Gospel.",
      es: "Amiga de San Francisco y fundadora de las Clarisas. Abrazó la pobreza radical como camino a Dios, hecha espejo del Evangelio.",
    },
  },
  "8/14": {
    name: { en: "St. Maximilian Kolbe", es: "San Maximiliano Kolbe" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Franciscan priest who voluntarily took the place of a condemned family man in Auschwitz's starvation bunker. Martyred August 14, 1941.",
      es: "Sacerdote franciscano que se ofreció a ocupar el lugar de un padre de familia condenado en el búnker del hambre de Auschwitz. Mártir el 14 de agosto de 1941.",
    },
  },
  "8/15": {
    name: { en: "Assumption of the Virgin Mary", es: "Asunción de la Virgen María" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "Mary, having completed her earthly life, was taken body and soul into heavenly glory — the first to share fully in her Son's resurrection.",
      es: "María, terminada su vida terrena, fue llevada en cuerpo y alma a la gloria del cielo — la primera en participar plenamente de la resurrección de su Hijo.",
    },
  },
  "8/17": {
    name: { en: "St. Hyacinth", es: "San Jacinto de Polonia" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Polish Dominican called the 'Apostle of the North,' who carried the Gospel across Eastern Europe and is said to have crossed the Vistula on his cloak.",
      es: "Dominico polaco llamado el 'Apóstol del Norte', que llevó el Evangelio por el oriente de Europa y, según la tradición, cruzó el Vístula sobre su capa.",
    },
  },
  "8/20": {
    name: { en: "St. Bernard of Clairvaux", es: "San Bernardo de Claraval" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Cistercian abbot and Doctor of the Church whose mystical writings on divine love shaped medieval Christianity and Marian devotion.",
      es: "Abad cisterciense y Doctor de la Iglesia, cuyos escritos místicos sobre el amor divino modelaron la cristiandad medieval y la devoción mariana.",
    },
  },
  "8/22": {
    name: { en: "Queenship of Mary", es: "Santa María Reina" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Mary reigns as Queen at the side of her Son, crowned in the glory of the Assumption. Her royalty is the splendor of humble service.",
      es: "María reina junto a su Hijo, coronada en la gloria de la Asunción. Su realeza es el esplendor del servicio humilde.",
    },
  },
  "8/24": {
    name: { en: "St. Bartholomew", es: "San Bartolomé" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "One of the Twelve Apostles, who tradition says carried the Gospel to India and Armenia and was martyred by being flayed alive.",
      es: "Uno de los Doce Apóstoles. La tradición dice que llevó el Evangelio a la India y a Armenia y que fue martirizado siendo desollado vivo.",
    },
  },
  "8/27": {
    name: { en: "St. Monica", es: "Santa Mónica" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "The mother of St. Augustine, whose decades of prayer and tears obtained her wayward son's conversion. Patron of mothers and of those with difficult families.",
      es: "Madre de San Agustín, cuyas décadas de oración y lágrimas obtuvieron la conversión de su hijo descarriado. Patrona de las madres y de las familias difíciles.",
    },
  },
  "8/28": {
    name: { en: "St. Augustine", es: "San Agustín" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Bishop of Hippo and Doctor of Grace, one of Christianity's greatest minds. 'Our heart is restless, O Lord, until it rests in Thee.'",
      es: "Obispo de Hipona y Doctor de la Gracia, una de las más grandes mentes del cristianismo. 'Nuestro corazón está inquieto, Señor, hasta que descanse en Ti.'",
    },
  },
  "9/3": {
    name: { en: "St. Gregory the Great", es: "San Gregorio Magno" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Pope, Doctor of the Church, and reformer who sent Augustine to England, gave us Gregorian chant, and called himself 'servant of the servants of God.'",
      es: "Papa, Doctor de la Iglesia y reformador que envió a Agustín a Inglaterra, nos dejó el canto gregoriano y se llamó a sí mismo 'siervo de los siervos de Dios'.",
    },
  },
  "9/5": {
    name: { en: "St. Teresa of Calcutta", es: "Santa Teresa de Calcuta" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Foundress of the Missionaries of Charity, who saw 'the face of Christ in distressing disguise' in the poorest of the poor on the streets of Calcutta.",
      es: "Fundadora de las Misioneras de la Caridad, que vio 'el rostro de Cristo bajo angustioso disfraz' en los más pobres entre los pobres de las calles de Calcuta.",
    },
  },
  "9/8": {
    name: { en: "Birth of the Virgin Mary", es: "Natividad de la Virgen María" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "The birthday of Mary, who was prepared from conception to be the Mother of God. The Church rejoices in her birth as dawn before the rising of the Sun.",
      es: "Aniversario del nacimiento de María, preparada desde su concepción para ser Madre de Dios. La Iglesia se alegra de su nacimiento como aurora antes del Sol.",
    },
  },
  "9/13": {
    name: { en: "St. John Chrysostom", es: "San Juan Crisóstomo" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Archbishop of Constantinople and Doctor of the Church, the greatest preacher of antiquity. His name means 'golden-mouthed.'",
      es: "Arzobispo de Constantinopla y Doctor de la Iglesia, el más grande predicador de la antigüedad. Su nombre significa 'boca de oro'.",
    },
  },
  "9/14": {
    name: { en: "Exaltation of the Holy Cross", es: "Exaltación de la Santa Cruz" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "A feast honoring the Cross as the instrument of salvation — the wood that bore the fruit of eternal life.",
      es: "Fiesta que honra la Cruz como instrumento de salvación — el madero que dio el fruto de la vida eterna.",
    },
  },
  "9/15": {
    name: { en: "Our Lady of Sorrows", es: "Nuestra Señora de los Dolores" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Mary's seven sorrows, culminating at Calvary, reveal a mother's love and her compassion with the suffering Christ.",
      es: "Los siete dolores de María, que culminan en el Calvario, revelan el amor de una Madre y su compasión con Cristo sufriente.",
    },
  },
  "9/21": {
    name: { en: "St. Matthew", es: "San Mateo" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Tax collector turned apostle and evangelist, Matthew's Gospel proclaims Jesus as the fulfilment of all the Law and the Prophets.",
      es: "Publicano convertido en apóstol y evangelista, su Evangelio proclama a Jesús como cumplimiento de toda la Ley y los Profetas.",
    },
  },
  "9/27": {
    name: { en: "St. Vincent de Paul", es: "San Vicente de Paúl" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Patron of all charitable works, Vincent organized care for the poor and founded institutions of mercy whose spirit continues worldwide.",
      es: "Patrono de toda obra de caridad. Organizó la atención a los pobres y fundó instituciones de misericordia cuyo espíritu continúa en el mundo entero.",
    },
  },
  "9/29": {
    name: { en: "Sts. Michael, Gabriel, and Raphael", es: "Santos Miguel, Gabriel y Rafael" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "The three archangels — Michael the warrior, Gabriel the messenger, Raphael the healer — honored as God's heavenly messengers.",
      es: "Los tres arcángeles — Miguel el guerrero, Gabriel el mensajero y Rafael el sanador — venerados como mensajeros celestiales de Dios.",
    },
  },
  "9/30": {
    name: { en: "St. Jerome", es: "San Jerónimo" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Doctor of the Church and translator of the Latin Bible (the Vulgate), Jerome's lifelong dedication to Scripture was fierce and fruitful.",
      es: "Doctor de la Iglesia y traductor de la Biblia latina (la Vulgata). Su dedicación de por vida a la Escritura fue ardiente y fecunda.",
    },
  },
  "10/1": {
    name: { en: "St. Thérèse of Lisieux", es: "Santa Teresa de Lisieux" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "The Little Flower and Doctor of the Church. Her 'Little Way' showed that ordinary love lived with extraordinary fidelity is the path to holiness.",
      es: "La Florecilla y Doctora de la Iglesia. Su 'Caminito' mostró que el amor cotidiano vivido con fidelidad extraordinaria es la senda de la santidad.",
    },
  },
  "10/2": {
    name: { en: "Guardian Angels", es: "Santos Ángeles Custodios" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "The Church gives thanks for the angels God assigns to each soul to protect and guide us on our journey to heaven.",
      es: "La Iglesia da gracias por los ángeles que Dios asigna a cada alma para protegerla y guiarla en el camino al cielo.",
    },
  },
  "10/4": {
    name: { en: "St. Francis of Assisi", es: "San Francisco de Asís" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Patron of Italy, ecology, and animals, Francis embraced radical poverty and bore the wounds of Christ in his own body. His joy was contagious.",
      es: "Patrono de Italia, de la ecología y de los animales. Francisco abrazó la pobreza radical y llevó en su cuerpo las llagas de Cristo. Su alegría era contagiosa.",
    },
  },
  "10/5": {
    name: { en: "Bl. Bartolo Longo", es: "Beato Bartolo Longo" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Dominican tertiary and converted satanist who became the rosary apostle of Pompeii, raising a great Marian shrine on the ashes of paganism.",
      es: "Terciario dominico y antiguo satanista convertido, apóstol del Rosario en Pompeya, donde levantó un gran santuario mariano sobre las cenizas del paganismo.",
    },
  },
  "10/7": {
    name: { en: "Our Lady of the Rosary", es: "Nuestra Señora del Rosario" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Instituted to give thanks for the 1571 victory at Lepanto, this feast honors Mary and the rosary prayer the Dominican Order has promoted for centuries.",
      es: "Instituida en acción de gracias por la victoria de Lepanto en 1571, esta memoria honra a María y la oración del Rosario que la Orden de Predicadores ha promovido durante siglos.",
    },
  },
  "10/11": {
    name: { en: "Pope St. John XXIII", es: "San Juan XXIII, Papa" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "The 'Good Pope John' who opened the windows of the Church by convoking the Second Vatican Council in a spirit of pastoral charity.",
      es: "El 'Buen Papa Juan' que abrió las ventanas de la Iglesia al convocar el Concilio Vaticano II con espíritu de caridad pastoral.",
    },
  },
  "10/15": {
    name: { en: "St. Teresa of Avila", es: "Santa Teresa de Ávila" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "First female Doctor of the Church and reformer of Carmel, whose Interior Castle maps the soul's journey through seven mansions to union with God.",
      es: "Primera mujer Doctora de la Iglesia y reformadora del Carmelo. Su Castillo interior traza el camino del alma por siete moradas hasta la unión con Dios.",
    },
  },
  "10/18": {
    name: { en: "St. Luke", es: "San Lucas" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Physician, evangelist, and companion of Paul. Luke's Gospel portrays the compassionate Christ, and Acts records the birth of the Church.",
      es: "Médico, evangelista y compañero de Pablo. Su Evangelio presenta al Cristo compasivo, y los Hechos recogen el nacimiento de la Iglesia.",
    },
  },
  "10/22": {
    name: { en: "Pope St. John Paul II", es: "San Juan Pablo II, Papa" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Polish pope, philosopher, and pilgrim of the world, who proclaimed 'Be not afraid!' and called every generation to the holiness of the Gospel.",
      es: "Papa polaco, filósofo y peregrino del mundo, que proclamó '¡No tengáis miedo!' y llamó a cada generación a la santidad del Evangelio.",
    },
  },
  "10/28": {
    name: { en: "Sts. Simon and Jude", es: "Santos Simón y Judas Tadeo" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Two apostles joined in the same feast — Simon the Zealot and Jude Thaddaeus, patron of hopeless causes and desperate situations.",
      es: "Dos apóstoles unidos en una misma fiesta — Simón el Zelota y Judas Tadeo, patrono de las causas imposibles y de las situaciones desesperadas.",
    },
  },
  "11/1": {
    name: { en: "All Saints", es: "Todos los Santos" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "The Church triumphant — canonized and unknown alike — all who now behold the face of God and intercede for those still on the way.",
      es: "La Iglesia triunfante — canonizados y desconocidos por igual — todos cuantos ya contemplan el rostro de Dios e interceden por los que aún caminamos.",
    },
  },
  "11/2": {
    name: { en: "All Souls", es: "Conmemoración de los Fieles Difuntos" },
    feast: { en: "Commemoration", es: "Conmemoración" },
    desc: {
      en: "All the faithful departed are remembered today. The Church prays that God's mercy may bring every soul to the light that has no evening.",
      es: "Hoy se recuerda a todos los fieles difuntos. La Iglesia ruega que la misericordia de Dios lleve a toda alma a la luz que no conoce ocaso.",
    },
  },
  "11/3": {
    name: { en: "St. Martin de Porres", es: "San Martín de Porres" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Dominican lay brother of Lima, Peru, the 'saint of the broom' who cared for the sick, the slaves, and the abandoned animals of his city. Patron of social justice and racial harmony.",
      es: "Fraile dominico cooperador de Lima, Perú, el 'santo de la escoba' que cuidaba a los enfermos, a los esclavos y a los animales abandonados de su ciudad. Patrono de la justicia social y de la armonía racial.",
    },
  },
  "11/4": {
    name: { en: "St. Charles Borromeo", es: "San Carlos Borromeo" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Cardinal-Archbishop of Milan who implemented the Council of Trent with care and thoroughness. Patron of catechists, seminarians, and bishops.",
      es: "Cardenal-arzobispo de Milán que aplicó con esmero y rigor el Concilio de Trento. Patrono de catequistas, seminaristas y obispos.",
    },
  },
  "11/11": {
    name: { en: "St. Martin of Tours", es: "San Martín de Tours" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "A Roman soldier who cut his cloak to clothe a beggar — and that night dreamed it was Christ who wore the half he gave away.",
      es: "Soldado romano que partió su capa para vestir a un mendigo — y aquella noche soñó que era Cristo quien llevaba la mitad regalada.",
    },
  },
  "11/13": {
    name: { en: "St. Frances Xavier Cabrini", es: "Santa Francisca Javier Cabrini" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Italian-born missionary to the immigrant poor of the Americas, founder of hospitals, schools, and orphanages, and first American citizen to be canonized.",
      es: "Misionera italiana entre los pobres inmigrantes de las Américas, fundadora de hospitales, escuelas y orfanatos, y primera ciudadana estadounidense canonizada.",
    },
  },
  "11/15": {
    name: { en: "St. Albert the Great", es: "San Alberto Magno" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Dominican Doctor of the Church, master of St. Thomas Aquinas, and patron of natural scientists. He showed that the study of creation honors its Creator.",
      es: "Dominico, Doctor de la Iglesia, maestro de Santo Tomás de Aquino y patrono de los naturalistas. Enseñó que el estudio de la creación honra a su Creador.",
    },
  },
  "11/17": {
    name: { en: "St. Elizabeth of Hungary", es: "Santa Isabel de Hungría" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "A queen who gave up her crown to serve the poor, and a Franciscan tertiary. Her life shows that royal dignity is perfected in humble charity.",
      es: "Reina que dejó su corona para servir a los pobres, y terciaria franciscana. Su vida muestra que la dignidad real se perfecciona en la caridad humilde.",
    },
  },
  "11/21": {
    name: { en: "Presentation of the Virgin Mary", es: "Presentación de la Virgen María" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Tradition recalls that the young Mary was presented in the Temple by her parents — a hidden offering preparing her to receive God in her womb.",
      es: "La tradición recuerda que la joven María fue presentada en el Templo por sus padres — una ofrenda oculta que la preparaba para recibir a Dios en su seno.",
    },
  },
  "11/22": {
    name: { en: "St. Cecilia", es: "Santa Cecilia" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Patron of musicians and sacred music, Cecilia was a Roman noblewoman who sang to God in her heart even on her wedding day.",
      es: "Patrona de los músicos y de la música sagrada, Cecilia fue una noble romana que cantaba a Dios en su corazón incluso el día de sus bodas.",
    },
  },
  "11/30": {
    name: { en: "St. Andrew", es: "San Andrés" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Brother of Peter and the first called by Christ, Andrew is patron of Scotland, Russia, and Greece. He brought others to meet the Lord.",
      es: "Hermano de Pedro y el primero llamado por Cristo. Andrés es patrono de Escocia, Rusia y Grecia. Conducía a otros al encuentro del Señor.",
    },
  },
  "12/3": {
    name: { en: "St. Francis Xavier", es: "San Francisco Javier" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Jesuit missionary who carried the Gospel across India and Japan, baptizing hundreds of thousands before dying alone on the way to China.",
      es: "Misionero jesuita que llevó el Evangelio a la India y al Japón, bautizando a cientos de miles antes de morir solo de camino a China.",
    },
  },
  "12/6": {
    name: { en: "St. Nicholas", es: "San Nicolás de Bari" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Bishop of Myra whose extraordinary secret generosity became the foundation of the Christmas gift-giving tradition beloved throughout the world.",
      es: "Obispo de Mira cuya extraordinaria generosidad oculta es origen de la tradición navideña de los regalos, querida en todo el mundo.",
    },
  },
  "12/7": {
    name: { en: "St. Ambrose", es: "San Ambrosio" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Bishop of Milan, Doctor of the Church, and mentor of Augustine. Ambrose stood before emperors and shaped the theology of Church and State.",
      es: "Obispo de Milán, Doctor de la Iglesia y maestro de Agustín. Ambrosio se enfrentó a los emperadores y dio forma a la teología de la Iglesia y el Estado.",
    },
  },
  "12/8": {
    name: { en: "Immaculate Conception", es: "Inmaculada Concepción" },
    feast: { en: "Solemnity", es: "Solemnidad" },
    desc: {
      en: "Mary was preserved from original sin from the very first moment of her existence, prepared by God's grace to bear his Son.",
      es: "María fue preservada del pecado original desde el primer instante de su existencia, preparada por la gracia de Dios para ser Madre de su Hijo.",
    },
  },
  "12/9": {
    name: { en: "St. Juan Diego", es: "San Juan Diego Cuauhtlatoatzin" },
    feast: { en: "Optional Memorial", es: "Memoria Opcional" },
    desc: {
      en: "Indigenous Mexican layman to whom Our Lady of Guadalupe entrusted her image on the tilma, and through whom she gave the New World its great Marian sign.",
      es: "Laico indígena mexicano a quien Nuestra Señora de Guadalupe confió su imagen en la tilma, y por cuyo medio dio al Nuevo Mundo su gran signo mariano.",
    },
  },
  "12/12": {
    name: { en: "Our Lady of Guadalupe", es: "Nuestra Señora de Guadalupe" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "Mary appeared to St. Juan Diego in 1531, leaving her miraculous image on his tilma. She remains the most-visited Marian shrine in the world.",
      es: "La Virgen se apareció a San Juan Diego en 1531 dejando su imagen milagrosa en su tilma. Sigue siendo el santuario mariano más visitado del mundo.",
    },
  },
  "12/13": {
    name: { en: "St. Lucy", es: "Santa Lucía" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "A Sicilian martyr whose name means 'light,' Lucy gave her dowry to the poor and gave her life rather than betray her faith.",
      es: "Mártir siciliana cuyo nombre significa 'luz'. Lucía entregó su dote a los pobres y dio la vida antes que traicionar la fe.",
    },
  },
  "12/14": {
    name: { en: "St. John of the Cross", es: "San Juan de la Cruz" },
    feast: { en: "Memorial", es: "Memoria" },
    desc: {
      en: "Co-founder of the Discalced Carmelites and Doctor of the Church, John mapped the soul's dark night as the path to mystical union with God.",
      es: "Cofundador de los Carmelitas Descalzos y Doctor de la Iglesia. San Juan de la Cruz trazó la noche oscura del alma como camino a la unión mística con Dios.",
    },
  },
  "12/26": {
    name: { en: "St. Stephen", es: "San Esteban" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "The first Christian martyr, stoned to death while he saw heaven open and prayed for his persecutors — perfectly mirroring Christ on the cross.",
      es: "Primer mártir cristiano, lapidado mientras veía abrirse el cielo y oraba por sus perseguidores — espejo perfecto de Cristo en la cruz.",
    },
  },
  "12/27": {
    name: { en: "St. John the Apostle", es: "San Juan Apóstol" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "The beloved disciple, theologian of love, and author of the Fourth Gospel. 'God is love, and whoever abides in love abides in God.' (1 Jn 4:16)",
      es: "El discípulo amado, teólogo del amor y autor del Cuarto Evangelio. 'Dios es amor, y quien permanece en el amor permanece en Dios.' (1 Jn 4,16)",
    },
  },
  "12/28": {
    name: { en: "Holy Innocents", es: "Santos Inocentes" },
    feast: { en: "Feast", es: "Fiesta" },
    desc: {
      en: "The children massacred by Herod in his search for the infant Christ — the first to die for Jesus, though they could not yet speak his name.",
      es: "Los niños asesinados por Herodes en su búsqueda del Niño Cristo — los primeros que murieron por Jesús, aun sin saber pronunciar su nombre.",
    },
  },
};

/**
 * Fallback rotation for days without a named feast. Each entry MUST have a
 * bilingual `feast` field — Dominican defaults to "Dominican Charism".
 */
export const DOMINICAN_SAINTS = [
  {
    name: { en: "St. Dominic", es: "Santo Domingo de Guzmán" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Founder of the Order of Preachers, whose life of prayer, study, and preaching continues in the Dominican charism at this church.",
      es: "Fundador de la Orden de Predicadores, cuya vida de oración, estudio y predicación continúa en el carisma dominicano de esta parroquia.",
    },
  },
  {
    name: { en: "St. Thomas Aquinas", es: "Santo Tomás de Aquino" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "The Angelic Doctor, who showed that the love of truth is itself a form of divine love.",
      es: "El Doctor Angélico, que mostró cómo el amor a la verdad es ya una forma del amor divino.",
    },
  },
  {
    name: { en: "St. Catherine of Siena", es: "Santa Catalina de Siena" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Doctor of the Church who called the Church back to holiness through love and truth.",
      es: "Doctora de la Iglesia que llamó a la Iglesia a volver a la santidad por el amor y la verdad.",
    },
  },
  {
    name: { en: "St. Martin de Porres", es: "San Martín de Porres" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Dominican lay brother who cared for the sick and poor of Lima, Peru. Patron of social justice.",
      es: "Fraile dominico cooperador que cuidó de los enfermos y pobres de Lima, Perú. Patrono de la justicia social.",
    },
  },
  {
    name: { en: "St. Rose of Lima", es: "Santa Rosa de Lima" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "First canonized saint of the Americas and Dominican tertiary, whose sufferings were a hidden fragrance offered to God.",
      es: "Primera santa canonizada de América y terciaria dominica, cuyos sufrimientos fueron una fragancia oculta ofrecida a Dios.",
    },
  },
  {
    name: { en: "Bl. Margaret of Castello", es: "Beata Margarita de Castello" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Dominican tertiary who was abandoned by her family yet found her home in God and among the poor.",
      es: "Terciaria dominica abandonada por su familia que halló su hogar en Dios y entre los pobres.",
    },
  },
  {
    name: { en: "St. Pius V", es: "San Pío V" },
    feast: { en: "Pope", es: "Papa" },
    desc: {
      en: "Dominican friar who became pope, reformed the Mass after Trent, and gave us the Feast of Our Lady of the Rosary.",
      es: "Fraile dominico que llegó a Papa, reformó la Misa tras Trento y nos dio la fiesta de Nuestra Señora del Rosario.",
    },
  },
  {
    name: { en: "St. Albert the Great", es: "San Alberto Magno" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Dominican Doctor of the Church and master of St. Thomas Aquinas, who saw the study of nature as a path of reverence toward its Creator.",
      es: "Dominico, Doctor de la Iglesia y maestro de Santo Tomás de Aquino, que vio el estudio de la naturaleza como camino de reverencia hacia su Creador.",
    },
  },
  {
    name: { en: "Bl. Jordan of Saxony", es: "Beato Jordán de Sajonia" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Second Master of the Order of Preachers, whose preaching drew almost a thousand men to the Dominican habit and whose letters remain a treasure of spiritual friendship.",
      es: "Segundo Maestro de la Orden de Predicadores. Su predicación llevó al hábito dominico a cerca de mil hombres y sus cartas siguen siendo un tesoro de amistad espiritual.",
    },
  },
  {
    name: { en: "St. Hyacinth", es: "San Jacinto de Polonia" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Polish Dominican called the 'Apostle of the North' for carrying the Gospel from Poland to the borders of China.",
      es: "Dominico polaco llamado el 'Apóstol del Norte' por haber llevado el Evangelio desde Polonia hasta los confines de China.",
    },
  },
  {
    name: { en: "St. Vincent Ferrer", es: "San Vicente Ferrer" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Valencian Dominican preacher of penance and 'Angel of the Apocalypse' whose missions crisscrossed late-medieval Europe with thousands of conversions.",
      es: "Predicador dominico valenciano de la penitencia y 'Ángel del Apocalipsis', cuyas misiones recorrieron Europa al fin de la Edad Media con millares de conversiones.",
    },
  },
  {
    name: { en: "Bl. Imelda Lambertini", es: "Beata Imelda Lambertini" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Dominican child mystic of the Eucharist, granted a miraculous First Communion and called home in ecstasy at age eleven.",
      es: "Niña mística dominica de la Eucaristía, a quien le fue dada milagrosamente la primera comunión y que fue llamada al cielo en éxtasis a los once años.",
    },
  },
  {
    name: { en: "Bl. Bartolo Longo", es: "Beato Bartolo Longo" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Dominican tertiary and former satanist whose conversion gave the Church the Marian sanctuary of Pompeii and a tireless apostolate of the rosary.",
      es: "Terciario dominico y antiguo satanista cuya conversión dio a la Iglesia el santuario mariano de Pompeya y un infatigable apostolado del Rosario.",
    },
  },
  {
    name: { en: "Bl. Pier Giorgio Frassati", es: "Beato Pier Giorgio Frassati" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Young Italian Dominican tertiary, 'man of the Beatitudes,' whose hidden service to Turin's poor and love of the mountains have inspired generations.",
      es: "Joven terciario dominico italiano, 'hombre de las Bienaventuranzas'. Su servicio escondido a los pobres de Turín y su amor a la montaña han inspirado a varias generaciones.",
    },
  },
  {
    name: { en: "St. Agnes of Montepulciano", es: "Santa Inés de Montepulciano" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Tuscan Dominican prioress and mystic remarkable for her humility, her ecstasies, and her tender devotion to the Christ Child.",
      es: "Priora y mística dominica toscana, célebre por su humildad, sus éxtasis y su tierna devoción al Niño Jesús.",
    },
  },
  {
    name: { en: "Bl. Reginald of Orléans", es: "Beato Reginaldo de Orleans" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Renowned canonist of Paris who received the Dominican habit from the Blessed Virgin herself and became one of the first companions of St. Dominic.",
      es: "Insigne canonista de París que recibió el hábito dominico de manos de la Santísima Virgen y fue uno de los primeros compañeros de Santo Domingo.",
    },
  },
  {
    name: { en: "St. Antoninus of Florence", es: "San Antonino de Florencia" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Dominican archbishop of Florence, reformer and moral theologian whose tireless care for the poor earned him the title 'father of the people.'",
      es: "Arzobispo dominico de Florencia, reformador y teólogo moral, cuya solicitud por los pobres le mereció el título de 'padre del pueblo'.",
    },
  },
  {
    name: { en: "Bl. Diana d'Andalo", es: "Beata Diana d'Andalo" },
    feast: { en: "Dominican Charism", es: "Carisma Dominicano" },
    desc: {
      en: "Bolognese noblewoman and foundress of the first Dominican monastery for women in her city, whose holy friendship with Bl. Jordan of Saxony gave the Order one of its great epistolary treasures.",
      es: "Noble boloñesa y fundadora del primer monasterio dominico de mujeres en su ciudad. Su santa amistad con el Beato Jordán de Sajonia dio a la Orden uno de sus grandes tesoros epistolares.",
    },
  },
];
