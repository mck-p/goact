package utils_test

import (
	"mck-p/goact/utils"
	"os"
	"testing"
)

func TestBasicGetEnv(t *testing.T) {
	previousValue := os.Getenv("TEST_ENV_1")

	os.Setenv("TEST_ENV_1", "123")
	result, err := utils.GetenvStr("TEST_ENV_1")

	if result != "123" || err != nil {
		t.Errorf("Expected result to be %s but got %s", "123", result)
	}

	os.Setenv("TEST_ENV_1", previousValue)
}

func TestBasicMissingGetEnv(t *testing.T) {
	previousValue := os.Getenv("TEST_ENV_1")

	os.Setenv("TEST_ENV_1", "")
	result, err := utils.GetenvStr("TEST_ENV_1")

	if err == nil {
		t.Errorf("Expected to get an error but instead got %s", result)
	}

	os.Setenv("TEST_ENV_1", previousValue)
}

func TestBoolGetEnv(t *testing.T) {
	previousValue := os.Getenv("TEST_ENV_1")

	os.Setenv("TEST_ENV_1", "false")
	result, err := utils.GetenvBool("TEST_ENV_1")

	if result || err != nil {
		t.Errorf("Expected %t but received %t", false, result)
	}

	os.Setenv("TEST_ENV_1", previousValue)
}

func TestIntGetEnv(t *testing.T) {
	previousValue := os.Getenv("TEST_ENV_1")

	os.Setenv("TEST_ENV_1", "123")
	result, err := utils.GetenvInt("TEST_ENV_1")

	if result != 123 || err != nil {
		t.Errorf("Expected %d but received %d", 123, result)
	}

	os.Setenv("TEST_ENV_1", previousValue)
}
