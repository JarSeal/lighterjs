import { Component, isComponentLoggerQuiet } from '../../Lighter';
import { createEmptyRootDiv } from '../testUtils';

describe('Basic Component tests', () => {
  beforeAll(() => {
    isComponentLoggerQuiet(true);
    createEmptyRootDiv();
  });

  it('should create an appRoot component with another component as a child and draw them to DOM', () => {
    const appRoot = new Component({ id: 'appRoot', attachId: 'root' });
    appRoot.draw();
    appRoot.add(new Component({ id: 'main-menu', tag: 'menu', text: 'Menu' })).draw();
    expect(appRoot.id).toEqual('appRoot');
    expect(appRoot.props.id).toEqual('appRoot');
    expect(appRoot.props.attachId).toEqual('root');
    expect(Object.keys(appRoot.children).length).toEqual(1);
    expect(appRoot.children['main-menu'].parent).toEqual(appRoot);
    expect(appRoot.children['main-menu'].id).toEqual('main-menu');
    expect(appRoot.children['main-menu'].props.id).toEqual('main-menu');
    expect(appRoot.children['main-menu'].props.tag).toEqual('menu');
    expect(appRoot.children['main-menu'].props.text).toEqual('Menu');

    const appRootElem = document.getElementById('root').children.item(0);
    const menuElem = appRootElem.children.item(0);
    expect(appRootElem.tagName).toEqual('DIV');
    expect(appRootElem.children.length).toEqual(1);
    expect(menuElem.tagName).toEqual('MENU');
    expect(menuElem.textContent).toEqual('Menu');

    appRoot.discard(true);
  });

  it('should create an appRoot component with attributes', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      attributes: { 'data-count': 12, test: 'some text' },
      style: { color: 'red', maxWidth: '12px' },
      classes: ['myClass', 'anotherClass'],
    });
    appRoot.draw();
    expect(appRoot.elem.getAttribute('id')).toEqual('appRoot');
    expect(appRoot.elem.getAttribute('data-count')).toEqual('12');
    expect(appRoot.elem.getAttribute('test')).toEqual('some text');
    expect(appRoot.elem.style.color).toEqual('red');
    expect(appRoot.elem.style.maxWidth).toEqual('12px');
    expect(appRoot.elem.classList.contains('myClass')).toBeTruthy();
    expect(appRoot.elem.classList.contains('anotherClass')).toBeTruthy();

    appRoot.discard(true);
  });

  it('should create an appRoot component with another component as a child and draw them to DOM', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'this is appRoot',
      classes: ['myClass'],
    });
    appRoot.draw();
    let appRootElem = document.getElementById('appRoot');
    expect(appRootElem !== null).toBeTruthy();
    expect(appRootElem.getAttribute('id')).toEqual('appRoot');
    expect(appRootElem.textContent).toEqual('this is appRoot');

    // New draw with new props
    appRoot.draw({ text: 'this is the updated appRoot text', classes: ['myClass2'] });
    appRootElem = document.getElementById('appRoot');
    expect(appRootElem.textContent).toEqual('this is the updated appRoot text');
    expect(appRootElem.classList.contains('myClass2')).toBeTruthy();
    expect(appRootElem.classList.contains('myClass')).toBeFalsy();

    appRoot.discard(true);
  });

  it('should add a click listener and make the click change the button text, and then remove the listener successfully', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
    });
    appRoot.draw();
    const button = appRoot.add({ _id: 'mybtn', template: '<button>My button</button>' }).draw();
    expect(document.getElementById('mybtn').textContent).toEqual('My button');
    let counter = 0;
    let componentIdFromListener;
    button.addListener({
      id: 'btn-click',
      type: 'click',
      fn: (e, componentReference) => {
        counter++;
        componentIdFromListener = componentReference.id;
        const elem = e.target;
        elem.textContent = 'Button text changed ' + counter;
      },
    });
    button.elem.click();
    expect(document.getElementById('mybtn').textContent).toEqual('Button text changed 1');
    expect(componentIdFromListener).toEqual('mybtn');

    button.removeListener('btn-click');
    button.elem.click();
    expect(document.getElementById('mybtn').textContent).toEqual('Button text changed 1');

    appRoot.discard(true);
  });
});
