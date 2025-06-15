const { Builder, By, until } = require('selenium-webdriver');

(async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:5173/login'); // URL de tu app

    // Espera a que cargue el formulario
    await driver.wait(until.elementLocated(By.id('email')), 5000);

    // Completa los campos
    await driver.findElement(By.id('email')).sendKeys('lunarmorer@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('xdcvfg560*');

    // Envía el formulario
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Espera a que redireccione o muestre algo del dashboard
    await driver.wait(until.urlContains('dashboard'), 5000);

    console.log('✅ Login test passed');
  } catch (err) {
    console.error('❌ Login test failed:', err);
  } finally {
    await driver.quit();
  }
})();
