import os

import pytest
from dotenv import load_dotenv

from api.client import ApiClient

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--base-url", action="store", default=BACKEND_URL, help="Backend API base URL"
    )


@pytest.fixture(scope="session")
def base_url(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("base_url")


@pytest.fixture(scope="session")
def client(base_url: str) -> ApiClient:
    """
    Shared typed API client.
    """

    return ApiClient(base_url)
