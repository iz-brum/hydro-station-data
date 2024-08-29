import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

// Função para encerrar tours ativos
function endCurrentTour() {
    if (Shepherd.activeTour) {
        Shepherd.activeTour.complete(); // Encerra o tour ativo
    }
}

export const startDataViewTour = () => {
    const tourShownKey = 'dataViewTourShown'; // Chave para armazenar o status do tour no localStorage

    // Verifica se o tour já foi mostrado
    const tourAlreadyShown = localStorage.getItem(tourShownKey);

    if (tourAlreadyShown) {
        return; // Se o tour já foi mostrado, não inicia novamente
    }

    endCurrentTour(); // Encerra qualquer tour ativo

    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            scrollTo: { behavior: 'smooth', block: 'center' },
            classes: 'shepherd-element',
            cancelIcon: {
                enabled: true
            },
            arrow: true,
            buttons: [
                {
                    text: 'Voltar',
                    action: () => tour.back(),
                    classes: 'shepherd-button shepherd-button-secondary'
                },
                {
                    text: 'Próximo',
                    action: () => tour.next(),
                    classes: 'shepherd-button shepherd-button-primary'
                }
            ]
        }
    });

    const steps = [
        {
            id: 'view-toggle-grid',
            text: 'Clique aqui para alternar para a visualização em grade/lista.',
            attachTo: { element: '.icon-visible', on: 'bottom' }
        },
        {
            id: 'grafico_control',
            text: 'Aqui você pode ativar ou desativar o controle global de gráficos.',
            attachTo: { element: '#grafico_control', on: 'bottom' }
        },
        {
            id: 'station-details',
            text: 'Aqui estão os detalhes da estação.',
            attachTo: { element: '.details.section', on: 'bottom' }
        },
        {
            id: 'rain-summary',
            text: 'Aqui está o resumo de chuva.',
            attachTo: { element: '.rain-summary.section', on: 'bottom' }
        },
        {
            id: 'hydro-data',
            text: 'Aqui estão os dados hidrométricos das últimas 24h.',
            attachTo: { element: '.hydro-data.section', on: 'bottom' }
        }
    ];

    steps.forEach(step => tour.addStep(step));

    const removeAllHighlights = () => {
        steps.forEach(step => {
            const element = document.querySelector(step.attachTo.element);
            if (element) {
                element.classList.remove('shepherd-target-highlight');
            }
        });
    };

    tour.on('complete', () => {
        removeAllHighlights();
        localStorage.setItem(tourShownKey, 'true'); // Marca o tour como mostrado
    });

    tour.on('cancel', () => {
        removeAllHighlights();
        localStorage.setItem(tourShownKey, 'true'); // Marca o tour como mostrado mesmo se for fechado com o X
    });

    tour.start();
};
