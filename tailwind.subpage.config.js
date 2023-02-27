const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

let onlySubpages = [];
let scanAllSubpages = glob.sync(path.resolve(__dirname, 'views/*.php')).reduce(function (obj, el, i, arr) {
    if (path.parse(el).name != 'index' && path.parse(el).name != 'page_anasayfa') {
        onlySubpages.push(el);
    }
    return arr;
}, []);


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: onlySubpages,
    mode: 'jit',
    theme: {

        extend: {
            zIndex: {
                '5000': '5000',
                '5100': '5100',
                '5200': '5200',
                '5300': '5300',
                '5400': '5400',
                '5500': '5500',
            },
            aspectRatio: {
                '4/3': '4 / 3',
            },
            transitionTimingFunction: {
                'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
                'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
                'apple-cubic': 'cubic-bezier(0.25, 0.1, 0.25, 1)'
            }
        },
        fontFamily: {
            'sans': ['Lexend Deca', 'ui-sans-serif', 'system-ui'],
        },
        container: {
            padding: '2rem',
        },
        colors: {
            primary: '#22386a',
            secondary: '#fdc500',
            blue: '#22386a',
            slate: colors.slate
            // ...
        },
        transitionDuration: {
            DEFAULT: '288ms'
        },
        transitionDelay: {
            '0': '0ms',
            '1100': '1100ms',
            '1200': '1200ms',
            '1300': '1300ms',
            '1400': '1400ms',
            '1500': '1500ms',
            '1600': '1600ms',
            '1700': '1700ms',
            '1800': '1800ms',
            '1900': '1900ms',
            '2000': '2000ms',
        }
    },
    plugins: [
        // require('tailwind-bootstrap-grid')({
        //   containerMaxWidths: { sm: '540px', md: '720px', lg: '960px', xl: '1140px' },
        // }),
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.flex-gap-x-1': {
                    '--flex-gap-x': '0.25rem',
                },

                '.flex-gap-1': {
                    '--flex-gap-x': '0.25rem',
                    '--flex-gap-y': '0.25rem'
                },
                '.flex-gap-2': {
                    '--flex-gap-x': '0.5rem',
                    '--flex-gap-y': '0.5rem'
                },
                '.flex-gap-3': {
                    '--flex-gap-x': '1rem;',
                    '--flex-gap-y': '1rem;'
                },
                '.flex-gap-4': {
                    '--flex-gap-x': '1.5rem',
                    '--flex-gap-y': '1.5rem'
                },
                '.flex-gap-5': {
                    '--flex-gap-x': '3rem;',
                    '--flex-gap-y': '3rem;'
                },
                '.flex-gap-x-1': {
                    '--flex-gap-x': '0.25rem'
                },
                '.flex-gap-x-2': {
                    '--flex-gap-x': '0.5rem'
                },
                '.flex-gap-x-3': {
                    '--flex-gap-x': '1rem'
                },
                '.flex-gap-x-4': {
                    '--flex-gap-x': '1.5rem'
                },
                '.flex-gap-x-5': {
                    '--flex-gap-x': '3rem'
                },
                '.flex-gap-y-1': {
                    '--flex-gap-y': '0.25rem'
                },
                '.flex-gap-y-2': {
                    '--flex-gap-y': '0.5rem'
                },
                '.flex-gap-y-3': {
                    '--flex-gap-y': '1rem'
                },
                '.flex-gap-y-4': {
                    '--flex-gap-y': '1.5rem'
                },
                '.flex-gap-y-5': {
                    '--flex-gap-y': '3rem'
                },
            })
        })
    ],
}
