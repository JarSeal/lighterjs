import { Component, isComponentLoggerQuiet } from '../../LIGHTER';
import { createEmptyRootDiv, isUUID } from '../testUtils';

describe('Basic Component tests', () => {
  beforeAll(() => {
    isComponentLoggerQuiet(true);
    createEmptyRootDiv();
  });

  it('should create a basic text div', () => {
    const testText = 'Test text';
    const comp = new Component({ text: testText });
    expect(typeof comp.draw).toBe('function');
    expect(typeof comp.add).toBe('function');
    expect(typeof comp.addListener).toBe('function');
    expect(typeof comp.removeListener).toBe('function');
    expect(typeof comp.discard).toBe('function');
    expect(typeof comp.discard).toBe('function');
    expect(typeof comp.getComponentById).toBe('function');
    expect(typeof comp.getComponentElemById).toBe('function');
    expect(typeof comp._setElemData).toBe('function');
    expect(typeof comp._createDefaultTemplate).toBe('function');
    expect(typeof comp._checkParentAndAttachId).toBe('function');
    expect(comp.isComponent).toBeTruthy();
    expect(comp.children).toEqual({});
    expect(comp.listeners).toEqual({});
    expect(comp.listenersToAdd).toEqual([]);
    expect(comp.drawing).toBeFalsy();
    expect(comp.discarding).toBeFalsy();
    expect(comp.router).toEqual(null);
    expect(isUUID(comp.id)).toBeTruthy();
    expect(isUUID(comp.props.id)).toBeTruthy();
    expect(comp.props.text).toEqual(testText);
  });

  it('should fail when trying to draw a component without a parent or attachId', () => {
    const comp = new Component();
    let errorMsg = '';
    try {
      comp.draw();
    } catch (err) {
      errorMsg = err.message;
    }
    expect(errorMsg).toEqual('Call stack');
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
    expect(menuElem.innerText).toEqual('Menu');

    appRoot.discard(true);
    expect(document.getElementById('root').children.length).toEqual(0);
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
  });

  // Test for updating component props with new draw
});
