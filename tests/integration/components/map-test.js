import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import ENV from 'super-rentals/config/environment';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a map image for the specified parameters', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
    />`);

    assert
    .dom('.map img')
    .exists()
    .hasAttribute('alt', 'Map image at coordinates 37.7797,-122.4184')
    .hasAttribute('src')
    .hasAttribute('width', '150')
    .hasAttribute('height', '120');

    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.GEOAPIFY_ACCESS_TOKEN);

    assert.ok(
      src.startsWith('https://maps.geoapify.com/'),
      'the src starts with "https://maps.geoapify.com/"',
    );

    assert.ok(
      src.includes('-122.4184'),
      'the src should include the lng',
    );

    assert.ok(
      src.includes('37.7797'),
      'the src should include the lat',
    );

    assert.ok(
      src.includes('10'),
      'the src should include the zoom parameter',
    );

    assert.ok(
      src.includes('width=150&height=120'),
      'the src should include the width,height',
    );

    assert.ok(
      src.includes(`apiKey=${token}`),
      'the src should include the escaped access token',
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      alt="A map of San Francisco"
    />`);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(hbs`<Map
      @lat="37.7797"
      @lng="-122.4184"
      @zoom="10"
      @width="150"
      @height="120"
      src="/assets/images/teaching-tomster.png"
      width="200"
      height="300"
    />`);

    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/maps\.geoapify\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');

  });
});
