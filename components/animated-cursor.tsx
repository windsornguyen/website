import AnimatedCursor from 'react-animated-cursor';

export default function App() {
  return (
    <div className='App'>
      <AnimatedCursor
        innerSize={12}
        outerSize={12}
        color='193, 11, 111'
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={5}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'input[type="button"]',
          'input[type="checkbox"]',
          'input[type="radio"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '[role="button"]',
          '[role="link"]',
          '[role="checkbox"]',
          '[role="radio"]',
          '[role="switch"]',
          '.link',
          '.clickable',
        ]}
        showSystemCursor={false}
      />
    </div>
  );
}
