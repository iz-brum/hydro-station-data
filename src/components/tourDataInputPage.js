import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css'; // Importa os estilos do Shepherd.js

// Função para finalizar qualquer tour existente
const endCurrentTour = () => {
    const existingTour = Shepherd.activeTour;
    if (existingTour) {
        existingTour.complete(); // Finaliza o tour existente
    }
};

export const startDataInputPageTour = () => {
    const tourShownKey = 'dataInputPageTourShown';

    // Verifica se o tour já foi mostrado
    const tourAlreadyShown = localStorage.getItem(tourShownKey);

    if (tourAlreadyShown) {
        return; // Se o tour já foi mostrado, não inicia novamente
    }

    // Finaliza qualquer tour corrente antes de iniciar um novo
    endCurrentTour();

    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            scrollTo: { behavior: 'smooth', block: 'center' },
            cancelIcon: {
                enabled: true
            },
            arrow: true,
            buttons: [],
            classes: 'custom-shepherd',
        }
    });

    const steps = [
        {
            id: 'ficha',
            text: 'Aqui você pode selecionar os filtros para os dados exibidos na Ficha da estação.',
            attachTo: { element: '#ficha', on: 'bottom' },
            buttons: [
                {
                    text: 'Próximo',
                    action: () => tour.next(),
                    classes: 'shepherd-button shepherd-button-primary'
                }
            ],
            when: {
                show: () => {
                    document.querySelector('.shepherd-element').style.marginBottom = '20px';
                }
            }
        },
        {
            id: 'resumo',
            text: 'Aqui você pode selecionar os filtros para os dados exibidos no Resumo de Chuva.',
            attachTo: { element: '#resumo', on: 'bottom' },
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
            ],
            when: {
                show: () => {
                    document.querySelector('.shepherd-element').style.marginBottom = '20px';
                }
            }
        },
        {
            id: 'hidro24h',
            text: 'Aqui você pode selecionar os filtros para os dados exibidos nos Dados Hidrométricos 24h.',
            attachTo: { element: '#hidro24h', on: 'bottom' },
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
            ],
            when: {
                show: () => {
                    document.querySelector('.shepherd-element').style.marginBottom = '20px';
                }
            }
        },
        {
            id: 'list-stations',
            text: 'Digite os códigos das estações separados por vírgulas.',
            attachTo: { element: '#list-stations', on: 'bottom' },
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
            ],
            when: {
                show: () => {
                    document.querySelector('.shepherd-element').style.marginBottom = '20px';
                }
            }
        },
        {
            id: 'faSearch',
            text: 'Clique aqui para buscar e exibir os dados.',
            attachTo: {
                element: '#faSearch',
                on: 'right' // Mantenha "right" para referência inicial
            },
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
            ],
            when: {
                show: () => {
                    const element = document.querySelector('.shepherd-element');
                    const targetElement = document.querySelector('#faSearch');
                    const targetRect = targetElement.getBoundingClientRect();

                    // Posicionando com base no ícone alvo
                    element.style.position = 'absolute';
                    element.style.top = `${targetRect.top + window.scrollY}px`; // Alinhamento vertical
                    element.style.left = `${targetRect.right + 10}px`; // Desloca para a direita

                    // Ajuste do transform para correção fina
                    element.style.transform = 'translateY(-50%)'; // Ajusta para centralizar verticalmente
                    document.querySelector('.shepherd-arrow').style.display = 'none'; // Esconde a seta
                }
            }
        },
        {
            id: 'faEye',
            text: 'Clique aqui para revisar os dados antes do download.',
            attachTo: {
                element: '#faEye',
                on: 'right' // Tentamos ajustar a posição para a direita
            },
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
            ],
            when: {
                show: () => {
                    const element = document.querySelector('.shepherd-element');
                    element.style.left = '10px'; // Deslocamento à direita
                    document.querySelector('.shepherd-arrow').style.marginLeft = '-10px'; // Ajustar a seta, se necessário
                    document.querySelector('.shepherd-arrow').style.left = '10px'; // Ajustar a seta para não sobrepor
                }
            }
        },
        {
            id: 'faFileDownload',
            text: 'Clique aqui para confirmar e baixar os dados em XLSX.',
            attachTo: {
                element: '#faFileDownload',
                on: 'right' // Tentamos ajustar a posição para a direita
            },
            buttons: [
                {
                    text: 'Voltar',
                    action: () => tour.back(),
                    classes: 'shepherd-button shepherd-button-secondary'
                },
                {
                    text: 'Concluir',
                    action: () => tour.complete(),
                    classes: 'shepherd-button shepherd-button-primary'
                }
            ],
            when: {
                show: () => {
                    const element = document.querySelector('.shepherd-element');
                    element.style.left = '10px'; // Deslocamento à direita
                    document.querySelector('.shepherd-arrow').style.marginLeft = '-10px'; // Ajustar a seta, se necessário
                    document.querySelector('.shepherd-arrow').style.left = '10px'; // Ajustar a seta para não sobrepor
                }
            }
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
        localStorage.setItem(tourShownKey, 'true');
    });

    tour.on('cancel', () => {
        removeAllHighlights();
        localStorage.setItem(tourShownKey, 'true');
    });

    tour.start();
};
