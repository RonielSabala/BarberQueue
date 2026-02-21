import os
from collections.abc import Iterator
from pathlib import Path

import pytest
import requests
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chromium.webdriver import ChromiumDriver

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "results" / "captures"


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--base-url", action="store", default=BACKEND_URL, help="Backend API base URL"
    )
    parser.addoption(
        "--frontend-url", action="store", default=FRONTEND_URL, help="Frontend base URL"
    )


@pytest.fixture(scope="session")
def base_url(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("base_url")


@pytest.fixture(scope="session")
def frontend_url(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("frontend_url")


@pytest.fixture(scope="session")
def api(base_url: str) -> requests.Session:
    """
    Shared HTTP session for all API tests.
    """

    session = requests.Session()
    session.base_url = base_url  # type: ignore[attr-defined]
    return session


@pytest.fixture(scope="function")
def driver(request: pytest.FixtureRequest) -> Iterator[ChromiumDriver]:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


@pytest.fixture(scope="function")
def capture_dir(request: pytest.FixtureRequest) -> Path:
    test_file_path = Path(request.node.fspath)
    capture_dir = SCREENSHOTS_DIR / test_file_path.parent.name / test_file_path.stem
    capture_dir.mkdir(parents=True, exist_ok=True)
    return capture_dir
