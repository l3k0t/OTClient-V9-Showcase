<div align="center">
  <img src="assets/otclient-v9-arte-principal.webp" alt="Arte oficial de apresentação do OTClient V9: personagens e criaturas em cenário medieval fantástico" width="100%" />

  # ⚔️ OTClient V9

  **A evolução de uma base clássica para uma nova geração de OTClient.**

  **C++23 · Protocolos modernos · Sprites e appearances · Novos sistemas Tibia**

  Desenvolvido e mantido por **L3K0T** · **Projeto em desenvolvimento**
</div>

> ⭐ **Acompanhe a evolução!** Clique em **Star** (⭐) no canto superior direito deste repositório para favoritar o projeto. Use **Watch → All Activity** para acompanhar commits, atualizações e anúncios publicados aqui.

---

## O que é o OTClient V9?

O **OTClient V9** é um projeto de modernização do **OTCv8**, mantendo sua identidade e ecossistema Lua/OTUI e ampliando a estrutura do cliente para atender aos protocolos e sistemas modernos do Tibia. A evolução técnica inclui o **C++23**, nova organização de funcionalidades por versão e suporte ao carregamento de recursos gráficos que não estavam presentes no carregador original da base comparada.

O desenvolvimento utiliza o **OTClient Redemption** como referência e fonte de adaptações de sistemas modernos; o **Canary** é a referência de comportamento de servidor e protocolos. Os créditos das bases e bibliotecas são preservados.

## Destaques da evolução

| Área | Base OTCv8 utilizada | Evolução no V9 |
|---|---|---|
| Núcleo | C++17 | Compilação do cliente completo em **C++23** |
| Sprites | Carregamento clássico de **DAT/SPR** | **Sprite Sheets modernas**, catálogo, appearances e protobuf |
| Protocolos | Tratamento tradicional de versões | **ProtocolProfile**, **ProtocolRegistry**, capacidades e GameFeatures |
| Sistemas modernos | Cobertura limitada na base comparada | Integrações para Cyclopedia, Bosstiary, Forge, Wheel, Taskboard e mais |
| Compilação | Configuração legada | CMake, vcpkg, testes e CI para **Windows x64 e Linux** |
| Login | Fluxos legados | Adaptações de **login HTTP / MyAAC / Canary 15.11** |

### 🎨 Sprites e assets de nova geração

- Integração de `SpriteAppearances` e carregamento de **Sprite Sheets compactadas**.
- Suporte estrutural a `catalog-content.json` e `appearances.dat` com **Protocol Buffers**.
- Leitura de informações modernas de itens, criaturas, outfits e animações.
- Seleção de assets conforme a versão; preservação do carregador DAT/SPR para protocolos antigos.
- Verificação de arquivos antes da conexão e correções de sincronização durante o carregamento de sprites.

<img src="assets/otclient-v9-evolucao.webp" alt="Arte do OTClient V9 mostrando a evolução visual do clássico para o moderno, com mago e cavaleiro" width="100%" />

### 🧩 Módulos e sistemas adicionados ou adaptados

**Exploração e personagem:** Cyclopedia, Character Inspection, Bestiary, Bosstiary, Cyclopedia Houses, Blessings e Main Panel.

**Combate e progressão:** Exaltation Forge, Wheel of Destiny, Weapon Proficiency, Monk (Harmony e Serene), Attached Effects e recursos modernos de combate.

**Tarefas e recompensas:** Taskboard, Soulseals, Reward Wall, Daily Rewards e Resource Balance.

**Inventário e serviços:** Quick Loot, Supply Stash, Imbuement Tracker e Store moderna.

**Interface e qualidade de vida:** Analyser, Health Circle, NPC Trade moderno e adaptações de estilos OTUI e Controllers.

**Observação:** *Market, Prey, Action Bar, Imbuing e NPC Trade já existiam no OTCv8 de referência.* No V9, esses recursos receberam correções, adaptações ou suporte a novos formatos; não são anunciados como sistemas originalmente inéditos.

### ⚙️ Engenharia e estabilidade

- Compilação do cliente completo com **C++23** nos pipelines **Linux/GCC** e **Windows x64/MSVC**.
- Correções de dependências, integração com Boost Asio e compatibilidade C++/Lua.
- `PacketReader` com verificações de limites, `PacketWriter` e `SequenceManager`.
- CMake, vcpkg, cache de compilação e empacotamento separado para mudanças em Lua/OTUI/assets.
- Testes automatizados de componentes e verificações básicas de inicialização do cliente.

## Protocolos: estágio real

| Protocolo | Objetivo | Situação |
|---|---|---|
| **8.60** | Preservar compatibilidade clássica | Testes de regressão pendentes |
| **10.98** | Preservar compatibilidade de transição | Testes de regressão pendentes |
| **15.11** | Login e jogo modernos com referência Canary | Integração em testes |
| **15.25** | Expandir a compatibilidade moderna | Implementação e validação em andamento |

> 🚧 **Importante:** integrar código, compilar e empacotar o cliente **não equivale** a comprovar login, renderização e gameplay perfeitos em todos os protocolos. Este é um **showcase de desenvolvimento**, não uma versão final ou anúncio de compatibilidade integral.

## Roadmap público

- [x] Modernizar a compilação do cliente para C++23.
- [x] Integrar os carregadores modernos de sprites e appearances na source.
- [x] Adicionar perfis/capacidades de protocolo e novos módulos.
- [x] Automatizar build e empacotamento para Windows e Linux.
- [ ] Concluir testes reais de login, movimentação e renderização para 15.11.
- [ ] Validar os sistemas e diferenças de protocolo até 15.25.
- [ ] Executar regressões de versões clássicas e testes prolongados de estabilidade.
- [ ] Publicar a primeira distribuição BETA após a validação necessária.

## ⭐ Favoritar e ficar por dentro

Se você acompanha o desenvolvimento de OTServ e OTClient, **favorite este repositório clicando em Star**. Para não perder atualizações, clique em **Watch** e escolha o nível de notificações de sua preferência.

**Toda novidade pública, avanço importante e anúncio de versão será divulgado aqui.**

**Desenvolvimento:** [L3K0T no GitHub](https://github.com/l3k0t)

---

<sub>Esta é uma página pública de apresentação. Não contém a source privada do cliente, arquivos internos de build, chaves, assets oficiais de Tibia ou binários do projeto. O OTCv8 e o OTClient Redemption conservam os créditos e licenças de seus autores originais. As artes desta página são ilustrativas e não são capturas do cliente em execução.</sub>