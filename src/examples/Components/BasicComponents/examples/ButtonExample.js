let buttonClickCounter = 0;

const ButtonExample = (parent, Button) => {
  parent
    .add(
      new Button({
        text: 'Button',
        attachId: 'examples',
        onClick: (e) => {
          buttonClickCounter++;
          console.log('Button clicked: ' + buttonClickCounter, e);
          parent.elem.querySelector('#examples').innerHTML = '';
          parent.componentInfo.examples(parent, Button);
        },
      })
    )
    .draw();
  parent.add({ text: 'Button clicks: ' + buttonClickCounter, attachId: 'examples' }).draw();
};

export default ButtonExample;
