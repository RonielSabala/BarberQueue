import time
from pathlib import Path

import pytest
from selenium.webdriver.chromium import webdriver


@pytest.mark.usefixtures("driver", "base_url", "capture_dir")
def test_hello_world(
    driver: webdriver.ChromiumDriver, base_url: str, capture_dir: Path
) -> None:
    """
    Test for the home page.
    """

    driver.get(f"{base_url}/home.php")

    time.sleep(0.5)

    driver.save_screenshot(capture_dir / "hello_world_message.png")
