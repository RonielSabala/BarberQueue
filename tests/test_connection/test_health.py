from pathlib import Path

import requests
from selenium.webdriver.chromium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

EXPECTED_TEXT = "Hello World"
EXPECTED_BODY_TEXT = EXPECTED_TEXT + "\n"
EXPECTED_ELEMENT_TAG = "body"
EXPECTED_CONTENT_TYPE = "text/plain; charset=utf-8"


def _get_health_url(base_url: str) -> str:
    """
    Return the health url page from `base_url`.
    """

    return f"{base_url}/health.php"


def test_health_endpoint(base_url: str):
    """
    Assert that the status code is 200.
    """

    url = _get_health_url(base_url)
    response = requests.get(url, timeout=5)

    assert response.status_code == 200, f"status {response.status_code}"

    body = response.text
    assert body == EXPECTED_BODY_TEXT, f"unexpected body: {body!r}"

    content_type = response.headers.get("Content-Type", "")
    assert content_type == EXPECTED_CONTENT_TYPE


def test_health_message(
    driver: webdriver.ChromiumDriver, base_url: str, capture_dir: Path
) -> None:
    """
    Open /health.php, wait for body, assert its text is "Hello World",
    and saves a screenshot.
    """

    url = _get_health_url(base_url)
    driver.get(url)

    wait = WebDriverWait(driver, 5)

    body_element = wait.until(
        EC.presence_of_element_located((By.TAG_NAME, EXPECTED_ELEMENT_TAG))
    )
    assert body_element.text == EXPECTED_TEXT

    screenshot_path = capture_dir / "health_message.png"
    driver.save_screenshot(screenshot_path)
