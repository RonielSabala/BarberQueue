from pathlib import Path

import pytest
from selenium import webdriver

PROJECT_URL = "http://localhost:1111"
OUTPUT_DIR = Path(__file__).resolve().parent / "results" / "captures"


def pytest_addoption(parser):
    parser.addoption(
        "--base-url", action="store", default=PROJECT_URL, help="Base app URL"
    )


@pytest.fixture(scope="session")
def base_url(request):
    return request.config.getoption("base_url")


@pytest.fixture(scope="function")
def driver(request):
    driver = webdriver.Chrome()
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


@pytest.fixture(scope="function")
def capture_dir(request):
    test_name = request.node.name
    story = Path(request.node.fspath).parent.name
    base = OUTPUT_DIR / story / test_name
    base.mkdir(parents=True, exist_ok=True)
    return str(base)
