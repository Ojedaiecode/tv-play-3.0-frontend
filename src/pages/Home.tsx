import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarGlobal from '../components/NavbarGlobal';
import BannerGlobal from '../components/BannerGlobal';
import FooterGlobal from '../components/FooterGlobal';
import { ChevronRight } from 'lucide-react';
import { useUserTracking } from '@/hooks/use-user-tracking';

// Interface para os dados dos cards
interface ShowCard {
  title: string;
  imageUrl: string;
}

// Interface para canais ao vivo
interface LiveChannel {
  title: string;
  imageUrl: string;
  currentShow: string;
  isLive: boolean;
}

// Interface para conteúdo premium
interface PremiumContent {
  title: string;
  imageUrl: string;
  description: string;
  isPremium: boolean;
}

// Dados dos shows gratuitos
const freeShows: ShowCard[] = [
  {
    title: "A Grande Família",
    imageUrl: "https://s2-globo-play.glbimg.com/7TkfDxMCpl3durDrULYdql3zzW8=/362x536/https://s2-globo-play.glbimg.com/rhiFbrR4vmW1h3zB9ACC8pG-u5I=/https://s2.glbimg.com/I3xuZarpVPozGuw-JIudD0ewA24=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2022/u/8/c55OrkS1mA6AxdeQfV9A/2022-3192-a-grande-familia-poster.jpg"
  },
  {
    title: "Toma Lá Dá Cá",
    imageUrl: "https://s2-globo-play.glbimg.com/RM9C_JTANY4n7_TogvWgYN1VsPA=/362x536/https://s2-globo-play.glbimg.com/NMbrjoTrk3qptEJxP_hV5yIRsOg=/https://s2.glbimg.com/VUb1fmoQryo4WpnWpgfHb27QwXg=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2024/L/B/mk9Fc2ShGkwiuaj5IPnw/2024-4530-toma-la-da-ca-poster.jpg"
  },
  {
    title: "O Futuro Já Começou",
    imageUrl: "https://s2-globo-play.glbimg.com/yFOiEcHe0Piy1XKBBFxX7R4s1Mw=/362x536/https://s2-globo-play.glbimg.com/TWcMIs6jTRNVfnwCPbs1Eu7-gCs=/https://s2.glbimg.com/jlBc9UiHRskvRyTkezK0UVEIA8E=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2025/m/x/wLp79xR6S4vwlxFYVQ8w/2025-4804-o-futuro-ja-comecou-poster.jpg"
  },
  {
    title: "Todo Mundo Odeia o Chris",
    imageUrl: "https://s2-globo-play.glbimg.com/usm1n4kuVgYfIIM3zpaoQILpng8=/362x536/https://s2-globo-play.glbimg.com/YDNCbNX8eDEcNOvBb13Zix-qHhc=/https://s2.glbimg.com/xe74Dgh6O9Grs3phBFUKLJ8c2r0=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2019/2/a/sdBJPWSOedTfVzkzfWPg/2019-463-series-cbs-jul-everybody-hates-chris-poster.jpg"
  },
  {
    title: "A Diarista",
    imageUrl: "https://s2-globo-play.glbimg.com/CkjpIcBxr9pA09JxuI8fF5hlW-I=/362x536/https://s2-globo-play.glbimg.com/z5jKqFpuH2gPJp0oZLC8KpJEauU=/https://s2.glbimg.com/vUk7siDiDZRBghL0zYSJaey5De0=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2019/e/g/W8H5ShRGqlK0bS1FeLMA/a-diarista-poster-web.jpg"
  },
  {
    title: "Os Normais",
    imageUrl: "https://s2-globo-play.glbimg.com/cM3r7mc94wi16atDxUr-GHIYHp4=/362x536/https://s2-globo-play.glbimg.com/MTKlkVND79AU0SPgq_ySiYiilCM=/https://s2.glbimg.com/YKeBBH-U2lT7Xf80k72YnfjE9AA=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2025/V/O/zUdeYRT2WEpQYNFm3Tjw/2025-4627-os-normais-poster.jpg"
  }
];

// Dados dos shows infantis
const kidsShows: ShowCard[] = [
  {
    title: "Tara Duncan",
    imageUrl: "https://s2-globo-play.glbimg.com/DzIPk9lVqG2ZSPUGF0mt7yOMyZg=/362x536/https://s2-globo-play.glbimg.com/_GOXlOq_G8rrndRq24WdOZ3F8OU=/https://s2.glbimg.com/A8UfpZRigS6dUveoBdtNvx3cBto=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2024/S/N/9x5v81RGyC8c9J9IbIlw/2024-tara-duncan-poster.jpg"
  },
  {
    title: "Pequeno Príncipe e seus amigos",
    imageUrl: "https://s2-globo-play.glbimg.com/-DS3hahVZQAGT4py1JZA3DAapHo=/362x536/https://s2-globo-play.glbimg.com/5qn9WtUSk73M1Zmy552siw2XyB8=/https://s2.glbimg.com/IHkZlvJmVLtOMXJuJE6c_bV4OM8=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2023/H/I/92Tfj7Rv6AOXo6F8QR7w/2023-3709-pequeno-principe-e-seus-amigos-poster.jpg"
  },
  {
    title: "D.P.A De Volta Ao Clubinho",
    imageUrl: "https://s2-globo-play.glbimg.com/FXsWYBHMtsICIRUBUfdfHR0pJkg=/362x536/https://s2-globo-play.glbimg.com/BDV9jSVxQHS9KfB29czgcfzILVw=/https://s2.glbimg.com/llzBB2Q_MKOK-Lv2t2-mCOGvHVA=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2022/M/e/B48fg5RCqoyAvK3HVW2A/2022-69-de-volta-ao-clubinho-poster.jpg"
  },
  {
    title: "Tainá e os Guardiões da Amazônia",
    imageUrl: "https://s2-globo-play.glbimg.com/Kisb_xe9CgWezk8se5OQE0eY3Co=/362x536/https://s2-globo-play.glbimg.com/pcMC-6rvghtGU9bHhL7b1pTPxsc=/https://s2.glbimg.com/EAI-52-MNqf5lC5M0YfXwdRW1zc=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2023/I/g/sxPfrBS4214AXTX8ryzA/2023-taina-e-os-guardioes-da-amazonia-poster.jpg"
  },
  {
    title: "Galinha Pintadinha",
    imageUrl: "https://s2-globo-play.glbimg.com/r119GVHp7zRGWJ8YTTolA_6zJ-w=/362x536/https://s2-globo-play.glbimg.com/6gS1--4JUFpxsciuGOy8p1eV1qI=/https://s2.glbimg.com/gk1HlPV9iVLPYW1tpNDBN3bsQHQ=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2021/j/p/z9CV75SouvFsGwwmtM5Q/2021-1711-galinha-pintadinha-poster.jpg"
  },
  {
    title: "Tropa da Rocinha",
    imageUrl: "https://s2-globo-play.glbimg.com/KBYKGBQpNZLktBHjb-x1zXi-IGc=/362x536/https://s2-globo-play.glbimg.com/xAEWE3NH_S6JDYU61lp_U0wGzbc=/https://s2.glbimg.com/Xl0rt2E8yk_grIJ3z-vbD6GGsYM=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2023/k/3/g3AkXIS4eRWoLnuhPPpg/2023-3594-tropa-da-roca-poster.jpg"
  }
];

// Dados dos canais ao vivo gratis (globo, sbt, record, band)
const liveChannels: LiveChannel[] = [
  {
    title: "Agora na Globo",
    imageUrl: "https://s2-redeglobo.glbimg.com/DjOT-jgM3o8O-XXXJEfozb_2ZKg=/0x0:2274x1234/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_b58693ed41d04a39826739159bf600a0/internal_photos/bs/2025/V/U/S58chbRvWBCmU2M5TF1g/captura-de-tela-2025-04-25-as-21.10.49.png",
    currentShow: "Agora",
    isLive: true
  },
  {
    title: "SBT",
    imageUrl: "https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2025/04/07/1431165982-sbt.jpg",
    currentShow: "Agora",
    isLive: true
  },
  {
    title: "Record Tv",
    imageUrl: "https://portal.comunique-se.com.br/wp-content/uploads/2022/01/Surto-de-Covid-19-faz-sindicato-cobrar-medidas-por-parte-da-Record-TV-740x387.jpg",
    currentShow: "Agora",
    isLive: true
  },
  {
    title: "Band",
    imageUrl: "https://braziljournal.com/wp-content/uploads/2022/06/164bcbd7-9e1a-b098-6489-da08bb218aac-857x482.jpg?x73457",
    currentShow: "Agora",
    isLive: true
  }
];

// Dados do conteúdo premium de futebol
const footballContent: PremiumContent[] = [
  {
    title: "Brasileirão Série A",
    imageUrl: "https://s2-globo-play.glbimg.com/WAFPS2Z8nh2VhiL7Ev_Mw5WCXDc=/0x196/https://s2-globo-play.glbimg.com/BgD6R2GR2rvD34Tyf7YRcogWXko=/https://i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2022/u/7/PIWVYuSqCQy1ijrmJ11Q/campeonato-brasileiro.jpg",
    description: "Campeonato Brasileiro",
    isPremium: true
  },
  {
    title: "Copa do Brasil",
    imageUrl: "https://s2-globo-play.glbimg.com/k1kjoKldsPJk3mXwBM5PU1ut0dQ=/0x196/https://s2-globo-play.glbimg.com/HGqQ3GjHB1EgOQCqcgujq_He44w=/https://i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2023/6/E/XmxGlGSWiPICrNKYNFhQ/copa-do-brasil-v4.jpg",
    description: "Mata-mata nacional",
    isPremium: true
  },
  {
    title: "Libertadores",
    imageUrl: "https://statics.otvfoco.com.br/2023/09/Logotipo-da-Libertadores-Reproducao-Internet-1024x512.jpg",
    description: "Torneio continental",
    isPremium: true
  },
  {
    title: "Champions League",
    imageUrl: "https://www.sportstourismnews.com/wp-content/uploads/2021/06/uefa-champions-league.jpg",
    description: "Liga dos Campeões",
    isPremium: true
  }
];

// Dados do conteúdo para fanáticos por futebol
const footballFanContent: PremiumContent[] = [
  {
    title: "Romário o Cara",
    imageUrl: "https://images.cdn.prd.api.discomax.com/xC1gp/weBLANqwIaabrkXcg.jpeg?w=300&f=webp",
    description: "",
    isPremium: true
  },
  {
    title: "Turma do Maestro",
    imageUrl: "https://s2-globo-play.glbimg.com/wzuQF7QZhOofcR48p7mwcsNe4WM=/362x536/https://s2-globo-play.glbimg.com/v8ygt-TO5Ze-dQB1bRVlIswXbrI=/https://s2.glbimg.com/Ylg9dsL3rvtqBzY5pwdGEE2kEYs=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2024/n/z/8npNDASEq3zegQlAYH3g/2024-turma-do-maestro-junior-poster-1-.jpg",
    description: "",
    isPremium: true
  },
  {
    title: "A Mão do Eurico",
    imageUrl: "https://s2-globo-play.glbimg.com/iYB5tdGVVdEx4cpbuUTGa5u8FM8=/362x536/https://s2-globo-play.glbimg.com/Y1bTh13tL461P4aYH5e5-tBRPZw=/https://s2.glbimg.com/UCDpn1ZI6m0o9o41hb4ZoMJXNAU=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2024/l/F/9eAKsvTWyYwF7rx7WcIQ/2023-3895-a-mao-do-eurico-poster.jpg",
    description: "",
    isPremium: true
  },
  {
    title: "Sou Corinthians",
    imageUrl: "https://s2-globo-play.glbimg.com/Z4zovvt59bHmH2rswEm13PvNDDY=/362x536/https://s2-globo-play.glbimg.com/6-MGoXvCqIfV7E8hRuRZ9jiuUMk=/https://s2.glbimg.com/tr6nuIK39yoiPNsMurn_H3rHU_o=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2022/c/g/0ycMdhQbO4hS93b1H51A/2022-3098-sou-corinthians-poster.jpg",
    description: "",
    isPremium: true
  },
  {
    title: "Haaland",
    imageUrl: "https://s2-globo-play.glbimg.com/-VAsFpA6bKT8iS9RDjr_8FEyAGs=/362x536/https://s2-globo-play.glbimg.com/af3osu92t7yxcNiiZxU6Wwh-0ho=/https://s2.glbimg.com/1M1Pmf2WcmDYiBEK6PcwZrr4YmQ=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2023/n/u/uxHcBQQFGj7wKV7zydBw/2023-haaland-poster.jpg",
    description: "",
    isPremium: true
  },
  {
    title: "Zico 70 Anos",
    imageUrl: "https://s2-globo-play.glbimg.com/7Yykr7Wk9JT8ZCE1629fIYxy7h4=/362x536/https://s2-globo-play.glbimg.com/sL0UgUPIR1RN0jPyDba02CVzo_s=/https://s2.glbimg.com/FGxwTQanFRHPbgHJywZ6-zRyGfE=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2024/Q/1/GAtLToRgWWBn3pCF5w7g/poster-1080-x-1600.jpg",
    description: "",
    isPremium: true
  }
];

// Dados dos filmes de comédia premium
const comedyMovies: PremiumContent[] = [
  {
    title: "A Herança de Mr.DEEDS",
    imageUrl: "https://images.cdn.prd.api.discomax.com/ZPqn-/EVWUgt4R5Pi1tHhRQ.jpeg?w=300&f=webp",
    description: "Comédia",
    isPremium: true
  },
  {
    title: "Os Farofeiros 2",
    imageUrl: "https://s2-globo-play.glbimg.com/E1W5JrjyFT-qTGPS-UEKMhHZO98=/362x536/https://s2-globo-play.glbimg.com/1rsMGFG9bGLmYnJIBNXSdhpzTRY=/https://s2.glbimg.com/N2eOBgfkzfMu6Shr59Qvsnxsjfc=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2025/Y/L/aNthIATluU99PW7N6OsA/2025-4772-os-farofeiros-2-poster.jpg",
    description: "Comédia nacional",
    isPremium: true
  },
  {
    title: "Minha Mãe é Uma Peça 3",
    imageUrl: "https://s2-globo-play.glbimg.com/oPcSJSoxnXgd1c9Qq9aVHMqPpik=/362x536/https://s2-globo-play.glbimg.com/Z5p77Vei8go4I7s69kFOCqowbfs=/https://s2.glbimg.com/wQO7ZMBYO4Utfm0SLx2t7-NYUgg=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2021/a/a/runEazS5O9UC7f3d2Kzw/2021-1788-minha-mae-peca-3-poster.jpg",
    description: "Comédia nacional",
    isPremium: true
  },
  {
    title: "Tô Ryca 2",
    imageUrl: "https://s2-globo-play.glbimg.com/fomon7l5hyRa_HJKxnSSshgQ-N4=/362x536/https://s2-globo-play.glbimg.com/fGIASu3rkCc1twnCwu6DDP0RATs=/https://s2.glbimg.com/asbmKkiJWYDtFQOO3NwDy9JV8Lg=/i.s3.glbimg.com/v1/AUTH_c3c606ff68e7478091d1ca496f9c5625/internal_photos/bs/2023/l/F/nDtnDAStuf63KcefYvZg/2023-3595-to-ryca-2-poster.jpg",
    description: "Comédia",
    isPremium: true
  },
  {
    title: "Sim Senhor",
    imageUrl: "https://images.cdn.prd.api.discomax.com/hSDbm/i4IjSL0gxd_nLqtwQ.jpeg?w=300&f=webp",
    description: "Comédia",
    isPremium: true
  },
  {
    title: "#PartiuFama",
    imageUrl: "https://images.cdn.prd.api.discomax.com/sAg1C/eHIzQr7oBNWDuQS4w.jpeg?w=300&f=webp",
    description: "Comédia",
    isPremium: true
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { deviceInfo, location } = useUserTracking();

  return (
    <div className="min-h-screen bg-gray-900">
      <NavbarGlobal />
      <BannerGlobal />
      
      {/* Main content area */}
      <main className="min-h-[50vh] bg-gray-900 px-2 sm:px-4 py-4 sm:py-8">
        <section className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          {/* Seção Séries Para Ver de Graça */}
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Para Ver de Graça</h2>
              <button className="flex items-center text-white/90 hover:text-white transition-colors text-sm sm:text-base">
                Mostrar mais
                <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Grid de cards de séries */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {freeShows.map((show, index) => (
                <div 
                  key={index}
                  className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={show.imageUrl}
                    alt={show.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
                      <h3 className="text-sm sm:text-base font-medium text-white line-clamp-2">{show.title}</h3>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Seção Ao Vivo Grátis */}
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Ao Vivo Grátis</h2>
              <button 
                onClick={() => navigate('/ao-vivo-gratis')}
                className="flex items-center text-white/90 hover:text-white transition-colors text-sm sm:text-base"
              >
                Mostrar mais
                <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Grid de cards ao vivo */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {liveChannels.map((channel, index) => (
                <div 
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => {
                    if (index === 0) navigate('/ao-vivo-gratis/globo-ao-vivo');
                    if (index === 1) navigate('/ao-vivo-gratis/sbt-rj-ao-vivo');
                  }}
                >
                  <img
                    src={channel.imageUrl}
                    alt={channel.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Overlay com gradiente e informações */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-300">{channel.currentShow}</p>
                          <h3 className="text-sm sm:text-base font-medium text-white">{channel.title}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
                          <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-blue-500/90 text-white rounded">Gratuito</span>
                          <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-red-500/90 text-white rounded">Ao vivo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Seção De Graça para as crianças */}
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">De Graça para as crianças</h2>
              <button className="flex items-center text-white/90 hover:text-white transition-colors text-sm sm:text-base">
                Mostrar mais
                <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Grid de cards infantis */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {kidsShows.map((show, index) => (
                <div 
                  key={index}
                  className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={show.imageUrl}
                    alt={show.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
                      <h3 className="text-sm sm:text-base font-medium text-white line-clamp-2">{show.title}</h3>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Seção Futebol (Para assinantes) */}
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Futebol (Para assinantes)</h2>
              <button className="flex items-center text-white/90 hover:text-white transition-colors text-sm sm:text-base">
                Mostrar mais
                <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Grid de cards de futebol */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {footballContent.map((content, index) => (
                <div 
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Overlay com gradiente e informações */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-300">{content.description}</p>
                          <h3 className="text-sm sm:text-base font-medium text-white">{content.title}</h3>
                        </div>
                        <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-yellow-500/90 text-white rounded">Premium</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Seção Para os fanáticos por futebol */}
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Para os fanáticos por futebol</h2>
              <button className="flex items-center text-white/90 hover:text-white transition-colors text-sm sm:text-base">
                Mostrar mais
                <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Grid de cards para fanáticos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {footballFanContent.map((content, index) => (
                <div 
                  key={index}
                  className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-medium text-white line-clamp-2">{content.title}</h3>
                        <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-yellow-500/90 text-white rounded">Premium</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Seção Filmes de comédia */}
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Filmes de comédia</h2>
              <button className="flex items-center text-white/90 hover:text-white transition-colors text-sm sm:text-base">
                Mostrar mais
                <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Grid de cards de comédia */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {comedyMovies.map((content, index) => (
                <div 
                  key={index}
                  className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-300">{content.description}</p>
                          <h3 className="text-sm sm:text-base font-medium text-white line-clamp-2">{content.title}</h3>
                        </div>
                        <span className="px-1.5 py-0.5 text-[10px] sm:text-xs bg-yellow-500/90 text-white rounded">Premium</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <FooterGlobal />
    </div>
  );
};

export default Home;
