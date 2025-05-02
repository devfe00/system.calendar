Sistema de Reservas - App Calendário

Aplicação frontend construída com React.js e FullCalendar, projetada para exibir as reservas de um provedor de serviços. 
O sistema permite que o provedor visualize, interaja e gerencie suas reservas de forma eficiente e interativa. O backend gerencia a lógica de negócio, 
incluindo a criação, leitura, atualização e exclusão de reservas. Ele fornece os dados necessários para o front, que os consome e exibe no calendário interativo. 
A aplicação consome dados de uma API que fornece as reservas, e o frontend mostra essas informações de maneira intuitiva no calendário. 
A comunicação entre o front e o back é feita através de requisições HTTP, com dados sendo enviados e recebidos em formato JSON.


🚀 Tecnologias Utilizadas

React.js: Framework JavaScript para construir interfaces de usuário.
FullCalendar: Biblioteca para exibição de calendários interativos com eventos.
Fetch API: Para consumir dados da API de reservas (exemplo /api/schedules/provider/{id}).


🌍 Funcionalidades

Visualização Interativa do Calendário: Mostra as reservas do provedor de serviços por mês, com possibilidade de clicar nos dias para ver mais detalhes.
Exibição de Eventos: Carrega eventos de um back-end e exibe-os no calendário.
Idioma em Português: Calendário e interação são exibidos em português.
Integração com API: O front-end consome os dados da API para preencher os eventos.


🛠 Personalização

Alterar o ID do provedor: No arquivo src/components/Calendar.js, altere o valor de fetch('/api/schedules/provider/1') para o ID do provedor que você deseja consultar.
Ajustar Eventos: O formato de exibição dos eventos pode ser modificado alterando a estrutura do mapeamento dos dados no código.
