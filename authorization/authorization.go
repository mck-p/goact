package authorization

import "log/slog"

func CanPerformAction(
	actorId string,
	resourceId string,
	action string,
) bool {
	slog.Debug("Checking for authorization",
		slog.String("actorId", actorId),
		slog.String("resourceId", resourceId),
		slog.String("action", action),
	)

	slog.Warn("Allowing everything for now. You should really do something here before launch")

	return true
}
