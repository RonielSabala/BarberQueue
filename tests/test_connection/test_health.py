from pathlib import Path

import requests
from selenium.webdriver.chromium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from header_type import HttpHeader

EXPECTED_TEXT = "Hello World"
EXPECTED_BODY_TEXT = EXPECTED_TEXT + "\n"
EXPECTED_UI_SELECTOR = (By.TAG_NAME, "body")


def _get_health_url(base_url: str) -> str:
    """
    Return the health url page from `base_url`.
    """

    return f"{base_url}/health"


def test_health_endpoint(base_url: str):
    """
    Assert that the server replies with a 200. Ensure the
    body contains the expected text and the content type
    is plain text.
    """

    url = _get_health_url(base_url)
    response = requests.get(url, timeout=5)

    assert response.status_code == 200, f"status {response.status_code}"

    body = response.text
    assert body == EXPECTED_BODY_TEXT, f"unexpected body: {body!r}"

    content_type = response.headers.get("Content-Type")
    assert content_type == HttpHeader.PLAIN_TEXT.content_type


def test_health_ui(
    driver: webdriver.ChromiumDriver, base_url: str, capture_dir: Path
) -> None:
    """
    Navigate to /health, wait for body, and verify the expected message
    is displayed.
    """

    url = _get_health_url(base_url)
    driver.get(url)

    wait = WebDriverWait(driver, 5)

    body_element = wait.until(EC.presence_of_element_located(EXPECTED_UI_SELECTOR))
    assert body_element.text == EXPECTED_TEXT

    screenshot_path = capture_dir / "health_message.png"
    driver.save_screenshot(screenshot_path)
