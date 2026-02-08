from collections.abc import Iterator
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.chromium.webdriver import ChromiumDriver

APP_URL = "http://localhost:3000"
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "results" / "captures"


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption("--base-url", action="store", default=APP_URL, help="Base app URL")


@pytest.fixture(scope="session")
def base_url(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("base_url")


@pytest.fixture(scope="function")
def driver(request: pytest.FixtureRequest) -> Iterator[ChromiumDriver]:
    driver = webdriver.Chrome()
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


@pytest.fixture(scope="function")
def capture_dir(request: pytest.FixtureRequest) -> Path:
    test_name = request.node.name
    test_path = request.node.fspath
    test_dir = Path(test_path).parent.name

    test_capture_dir = SCREENSHOTS_DIR / test_dir / test_name
    test_capture_dir.mkdir(parents=True, exist_ok=True)
    return test_capture_dir
