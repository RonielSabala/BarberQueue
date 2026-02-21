import os
from collections.abc import Iterator
from pathlib import Path

import pytest
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chromium.webdriver import ChromiumDriver

load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")
BACKEND_URL = os.getenv("BACKEND_URL")
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "results" / "captures"


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--base-url", action="store", default=BACKEND_URL, help="Base api URL"
    )


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
    test_file_path = Path(request.node.fspath)
    test_file_dir = test_file_path.parent.name

    test_capture_dir = SCREENSHOTS_DIR / test_file_dir / test_file_path.stem
    test_capture_dir.mkdir(parents=True, exist_ok=True)
    return test_capture_dir
