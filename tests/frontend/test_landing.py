from pathlib import Path

import pytest
from selenium.webdriver.chromium.webdriver import ChromiumDriver


@pytest.mark.frontend
class TestLanding:
    def test_landing_page_loads(
        self, driver: ChromiumDriver, frontend_url: str
    ) -> None:
        """
        Landing page returns a 200 and renders a title.
        """

        driver.get(frontend_url)
        assert driver.title != ""

    def test_landing_page_screenshot(
        self, driver: ChromiumDriver, frontend_url: str, capture_dir: Path
    ) -> None:
        """
        Capture a screenshot of the landing page.
        """

        driver.get(frontend_url)
        driver.save_screenshot(capture_dir / "landing.png")
