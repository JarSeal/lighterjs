let buttonClickCounter = 0;

const ButtonExample = (parent, Button) => {
  parent.addDraw(
    new Button({
      text: 'Button',
      attachId: 'examples',
      autoFocus: true,
      onClick: (e) => {
        buttonClickCounter++;
        console.log('Button clicked: ' + buttonClickCounter, e);
        parent.elem.querySelector('#examples').innerHTML = '';
        parent.componentInfo.examples(parent, Button);
      },
    })
  );
  parent.addDraw({ text: 'Button clicks: ' + buttonClickCounter, attachId: 'examples' });
};

export default ButtonExample;
