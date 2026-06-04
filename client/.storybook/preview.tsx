import type { Preview } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n/config';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        order: ['Premium', '*'],
      },
    },
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </I18nextProvider>
    ),
  ],
};

export default preview;
