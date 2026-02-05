import time

import pytest


@pytest.mark.usefixtures("driver", "base_url", "capture_dir")
def test_hello_world(driver, base_url, capture_dir):
    """
    Test for the home page.
    """

    driver.get(f"{base_url}/home.php")

    time.sleep(1)

    driver.save_screenshot(f"{capture_dir}/hello_world_msg.png")
