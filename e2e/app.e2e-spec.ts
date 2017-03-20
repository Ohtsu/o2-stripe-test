import { O2StripeTestPage } from './app.po';

describe('o2-stripe-test App', () => {
  let page: O2StripeTestPage;

  beforeEach(() => {
    page = new O2StripeTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
