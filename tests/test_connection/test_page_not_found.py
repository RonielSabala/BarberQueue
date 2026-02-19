from pathlib import Path

import requests
from selenium.webdriver.chromium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from header_type import HttpHeader

EXPECTED_TEXT = "Page Not Found..."
EXPECTED_UI_SELECTOR = (By.CLASS_NAME, "alert")


def _get_page_not_found_url(base_url: str) -> str:
    """
    Return a URL that is guaranteed not to exist.
    """

    return f"{base_url}/this-page-does-not-exist"


def test_page_not_found_endpoint(base_url: str):
    """
    Assert that the server replies with a 404. Ensure the body
    contains the alert message and the content type is HTML.
    """

    url = _get_page_not_found_url(base_url)
    response = requests.get(url, timeout=5)

    assert response.status_code == 404, f"status {response.status_code}"

    body = response.text
    assert EXPECTED_TEXT in body, f"alert message missing: {body!r}"

    content_type = response.headers.get("Content-Type")
    assert content_type == HttpHeader.HTML_TEXT.content_type


def test_page_not_found_ui(
    driver: webdriver.ChromiumDriver, base_url: str, capture_dir: Path
) -> None:
    """
    Navigate to an unknown page, wait for the alert element, and
    verify the expected message is displayed.
    """

    url = _get_page_not_found_url(base_url)
    driver.get(url)

    wait = WebDriverWait(driver, 5)

    alert_element = wait.until(EC.presence_of_element_located(EXPECTED_UI_SELECTOR))
    assert EXPECTED_TEXT in alert_element.text

    screenshot_path = capture_dir / "page_not_found.png"
    driver.save_screenshot(screenshot_path)
